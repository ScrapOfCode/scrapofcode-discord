import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder, Client, SlashCommandBuilder } from "discord.js";

type SubCommandOptions =
  | { 
        type: "subcommand", 
        name: string, 
        description?: string, 
    }
  | { 
        type: "subcommandGroup", 
        name: string, 
        description?: string, 
    }
  | { 
        type: "string", 
        name: string, 
        description?: string, 
    }
  | { 
        type: "integer", 
        name: string, 
        description?: string, 
    }
  | { 
        type: "boolean", 
        name: string, 
        description?: string, 
    }
  | { 
        type: "user", 
        name: string, 
        description?: string, 
    }
  | { 
        type: "channel", 
        name: string, 
        description?: string,
    }
  | { 
        type: "role", 
        name: string, 
        description?: string,
    }
  | { 
        type: "mentionable", 
        name: string, 
        description?: string,
    }
  | { 
        type: "number", 
        name: string, 
        description?: string,
    };

type CommandOpts = {
    data: {
        name: string,
        description?: string,
        subcommands: Array<{
            name: string,
            description: string,
            options: SubCommandOptions[],
            callback: (ctx: ChatInputCommandInteraction) => Promise<void>
        }>
    },
    callback?: (ctx: ChatInputCommandInteraction) => Promise<void>
}


export const createCommand = (client: Client, opts: CommandOpts) => {
    const { data, callback } = opts;

    const commandBuilder = new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description ?? "");

    if (data.subcommands) {
        for (const subcommand of data.subcommands) {
            const subCommandBuilder = new SlashCommandSubcommandBuilder()
                .setName(subcommand.name)
                .setDescription(subcommand.description);
        
            if (subcommand.options) {
                for (const option of subcommand.options) {
                    switch (option.type) {
                        case "string":
                            subCommandBuilder.addStringOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        case "integer":
                            subCommandBuilder.addIntegerOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        case "boolean":
                            subCommandBuilder.addBooleanOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        case "user":
                            subCommandBuilder.addUserOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        case "channel":
                            subCommandBuilder.addChannelOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        case "role":
                            subCommandBuilder.addRoleOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        case "mentionable":
                            subCommandBuilder.addMentionableOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        case "number":
                            subCommandBuilder.addNumberOption((opt) =>
                                opt.setName(option.name)
                                   .setDescription(option.description ?? "")
                            );
                            break;
                        default:
                            console.warn(`Unhandled option type: ${option.type}`);
                            break;
                    }
                }
            }
            commandBuilder.addSubcommand(subCommandBuilder);
        }
    }

    client.once('ready', async () => {
        try {
            await client.application?.commands.create(commandBuilder);
            console.log(`Slash command "/${data.name}" registered!`);
        } catch (error) {
            console.error(`Error registering slash command: ${error}`);
        }
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName === data.name) {
            const subcommand = data.subcommands?.find((sub: { name: string | null; }) => sub.name === interaction.options.getSubcommand(false));
            if (subcommand) {
                await subcommand.callback(interaction);
            } else {
                if(callback) {
                    await callback(interaction);
                }
            }
        }    
    });
};