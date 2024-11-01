import Client from "../utils/discord/client";
import { handleArticleCommand } from "./article";
import { handleExampleCommand } from "./example";

export const withCommandsModule = (client: Client) => {
    handleArticleCommand(client);
    handleExampleCommand(client);
}