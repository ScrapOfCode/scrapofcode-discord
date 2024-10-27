import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { client } from "..";
import { createCommand } from "../utils/discord/command";
import ky from "ky";

export const articleCommand = () => createCommand(client, {
    data: {
        name: "articles",
        description: "Command that manages articles",
        runWithPrefix: { run: true, prefix: "!" },
        subcommands: [
            {
                name: "all",
                description: "Loads all the articles from Prismic backend",
                callback: async (ctx, args) => {
                    try {
                        const jsonResponse = await ky.get("http://localhost:3000/api/articles").json<{
                            data: Array<{
                                title: string,
                                publishedAt: string,
                                cover: { url: string },
                                content: string
                            }>
                        }>();

                        if (jsonResponse.data.length === 0) {
                            await ctx.reply("No articles found.");
                            return;
                        }

                        const embeds = jsonResponse.data.map(article => {
                            return new EmbedBuilder()
                                .setColor("DarkAqua")
                                .setTitle(article.title)
                                .setURL(article.cover.url)
                                .setDescription(article.content)
                                .setThumbnail(article.cover.url)
                                .setFooter({ text: `Published on: ${article.publishedAt}` });
                        });

                        if (ctx instanceof Message) {
                           await ctx.reply({ embeds })
                        } else {
                           await ctx.reply({ embeds })
                        }
                        
                    } catch (error) {
                        console.error("Error fetching articles:", error);
                        await ctx.reply("Failed to fetch articles.");
                    }
                },
                options: []
            }
        ]
    }
});
