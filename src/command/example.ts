import { ChatInputCommandInteraction } from "discord.js";
import { createCommand } from "../utils/discord/command";
import { client } from "..";
import ky from 'ky';

export const exampleCommand = () => createCommand(client, {
    data: {
        name: "example",
        description: "Example command",
        subcommands: [
            {
                name: "ping",
                description: "Replies with Pong!",
                options: [
                    {
                        type: "string",
                        name: "message",
                        description: "Send a ping with your message",
                    }
                ],
                callback: async (ctx: ChatInputCommandInteraction) => {
                    await ctx.reply(`Ping, ${ctx.options.getString("message")}`)
                }
            },
            {
                name: "test_api",
                description: "Tests an express rest api result",
                options: [
                    {
                        type: "string",
                        name: "endpoint",
                        description: "Tests an rest api result by correct endpoint"
                    }
                ],
                callback: async (ctx: ChatInputCommandInteraction) => {
                    const endpointName = ctx.options.getString("endpoint", false);

                    if(!endpointName) {
                        const json = await ky.get("http://localhost:3000/").json();
                        await ctx.reply(JSON.stringify(json));
                    }

                    const json = await ky.get(`http://localhost:3000/${endpointName}`).json();
                    await ctx.reply(JSON.stringify(json));
                }
            }
        ]
    },
    callback: async () => {
        console.log("hello");
    }
});