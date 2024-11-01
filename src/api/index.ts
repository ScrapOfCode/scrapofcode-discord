import Client from "../utils/discord/client"
import { listArticleExpressRoute } from "./article"
import { getHelloExpressRoute } from "./hello";

export const withExpressModule = (client: Client) => {
    listArticleExpressRoute(client);
    getHelloExpressRoute(client);
}