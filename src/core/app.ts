import { Client, GatewayIntentBits, IntentsBitField, REST, Routes } from "discord.js";
import express from "express";
import winston from "winston";
import type { ConsoleTransportInstance } from "winston/lib/winston/transports";
import { AppContext, appContext } from "./context";
import { followAllRoutes } from "./command";
import {UserSchema} from "./zod/types/user";
import {z} from "zod";

type LauncherConfig = {
    name: string,
    description: string,
    version: string
}

class AppLogger {
    private readonly consoleTransport: ConsoleTransportInstance;

    public constructor() {
        this.consoleTransport = new winston.transports.Console();
    }

    public getLogger() {
        return winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message}) => {
                        return `[${timestamp}] ${level}: ${message}`;
                    }
                )),
            transports: [
                this.consoleTransport
            ]
        });
    }
}

export class AppLauncher {
    private logger: AppLogger;
    private readonly context: AppContext;
    private config: LauncherConfig;
    private readonly discordClient: Client;
    private express: { port: number, client: express.Express };
    private rest: REST;

    private constructor(config: LauncherConfig, expressPort?: number) {
        this.logger = new AppLogger();
        this.config = config;
        this.context = appContext.use();

        this.discordClient = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                IntentsBitField.Flags.Guilds, 
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.MessageContent 
            ]
        });

        this.rest = new REST().setToken(this.context.env.discord.token);
        this.express = { port: expressPort ?? 3000, client: express() };
    }

    public getDiscordClient(){
        return this.discordClient;
    }

    public getAppContext(){
        return this.context;
    }

    public getLogger(){
        return this.logger.getLogger();
    }

    public async launch(){
        this.logger.getLogger()
            .info(`App is running!`)
            .info(`App name: ${this.config.name}`)
            .info(`With description: ${this.config.description}`)
            .info(`And Version: ${this.config.version}`);

        this.discordClient.once("ready", (readyClient) => {
            this.logger.getLogger()
                .info(`Discord layer init status is success.`)
                .info(`Also, the bot connection ID is: ${readyClient.user.tag}`);
        })

        this.express.client.listen(this.express.port, () => {
            this.logger.getLogger()
                .info("Express client connection is success.")
                .info(`This connection is running on port: ${this.express.port}`);
        });

        await this.clearCommandCache();

        await followAllRoutes();
        await this.discordClient.login(this.context.env.discord.token);
    }

    private async clearCommandCache(){
        this.rest.put(Routes.applicationCommands(this.context.env.discord.clientId), { body: [] })
        .then(() => this.logger.getLogger().info("Deleting previous commands."))
        .catch(console.error);
    }
    
    static create(config: LauncherConfig, expressPort?: number){
        return new AppLauncher(config, expressPort);
    }
}