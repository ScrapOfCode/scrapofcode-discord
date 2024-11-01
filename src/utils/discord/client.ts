import { ClientOptions, Client as DiscordClient } from "discord.js";
import { CommandOpts, createCommand } from "./command";
import express from "express";
import { ApiRequest, createExpressRoute } from "../api";

export default class Client {
    private token: string;
    private discordClient: DiscordClient;
    private expressClient: express.Express;

    private constructor(token: string, options: ClientOptions){
        this.token = token;
        this.discordClient = new DiscordClient(options);
        this.expressClient = express();
    }

    public command(opts: CommandOpts){
        createCommand(this.discordClient, opts);
    }

    public expressRoute(apiRequest: ApiRequest){
        createExpressRoute(this.expressClient, apiRequest);
    }

    public init(){
        this.expressClient.listen(3000, () => {
            console.log("Listening to port 3000 for express app.");
        });

        this.discordClient.login(this.token);
    }

    static of(token: string, options: ClientOptions){
        return new Client(token, options);
    }
}