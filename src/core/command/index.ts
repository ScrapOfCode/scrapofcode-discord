import { getAppLauncher } from "../../public";
import * as path from "node:path";
import * as fs from "node:fs";
import { AppContext } from "../context";
import {CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder} from "discord.js";
import {ZodObject, ZodType} from "zod";
import { Transformer } from "./transformer";
import {parseSchema} from "./parser";

type DefineCreateCommandRequest = {
    createEndpoint: <T extends Record<string, any>>(
        name: string,
        description: string,
        argsSchema: ZodType<T>,
        callback: (interaction: CommandInteraction, args: T) => Promise<void>
    ) => Promise<void>;
};

async function createCommand(
    commandName: string,
    commandDescription: string,
    extra: (ctx: AppContext, req: DefineCreateCommandRequest) => Promise<void>
) {
    const app = getAppLauncher;
    const logger = app.getLogger();
    const discordClient = app.getDiscordClient();
    const endpoints: Array<{
        endpointName: string;
        endpointDescription: string;
        arguments: ZodType<Record<string, any>>;
    }> = [];

    const slashCommandBuilderInstance = new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(commandDescription ?? "");

    if (discordClient) {
        await extra(app.getAppContext(), {
            async createEndpoint<T extends Record<string, any>>(
                endpointName: string,
                endpointDescription: string,
                argsSchema: ZodType<T>,
                callback: (interaction: CommandInteraction, args: T) => Promise<void>
            ) {
                endpoints.push({
                    endpointName,
                    endpointDescription,
                    arguments: argsSchema,
                });

                discordClient.on("interactionCreate", async (interaction) => {
                    if (!interaction.isChatInputCommand()) return

                    if(interaction.commandName === commandName) {
                        if(interaction.options.getSubcommand(false) === endpointName){
                            const parsedSchema = parseSchema<T>(interaction, argsSchema);
                            await callback(interaction, parsedSchema);
                        }
                    }
                });
            },
        });

        const subCommands = endpoints.map((endpoint) => {
            const sub = new SlashCommandSubcommandBuilder()
                .setName(endpoint.endpointName)
                .setDescription(endpoint.endpointDescription);

            const transformer = new Transformer(endpoint.arguments, sub);
            transformer.addOptions();

            return sub;
        });

        subCommands.forEach((subCommand) => {
            slashCommandBuilderInstance.addSubcommand(subCommand);
        });

        discordClient.once("ready", async () => {
            try {
                const guild = discordClient.guilds.cache.get(app.getAppContext().env.discord.serverId);
                await guild?.commands.create(slashCommandBuilderInstance);

                logger
                    .info(`Registering slash command with route: (/${commandName})`)
                    .info(`${
                        JSON.stringify({
                            endpoints: endpoints.map((endpoint) => {
                                const args = endpoint.arguments._def;
                                let argumentNames: Array<string> = [];
                                
                                if(args instanceof ZodObject) {
                                    argumentNames = args.shape()
                                        ? Object.keys(args.shape())
                                        : [];
                                }

                                return {
                                    route: `/${commandName} ${endpoint.endpointName}`,
                                    args: argumentNames
                                };
                            }),
                        }, null, 2)
                    }`)
            } catch (error) {
                console.error(`Error registering slash command: ${error}`);
            }
        });
    }
}

export const followAllRoutes = async () => {
    const logger = getAppLauncher.getLogger();
    const directory = path.join(`${__dirname}`, "..", "..", "public", "command");
    const files = fs.readdirSync(directory);

    logger.info("Following routes:");

    for (const file of files) {
        if (file.endsWith(".command.ts")) {
            const filePath = path.join(directory, file);

            const getFileName = () => {
                const splitPath = filePath.split("/");
                return splitPath[splitPath.length - 1];
            };

            logger.info("- " + getFileName());

            try {
                const commandModule = await import(filePath);

                if (typeof commandModule.default === "function") {
                    commandModule.default();
                }
            } catch (error) {
                console.error(`Error while following file ${file}:`, error);
            }
        }
    }
};

export default createCommand;
