import Client from "../utils/discord/client";

export const getHelloExpressRoute = (client: Client) => client.expressRoute({
    type: "get",
    endpoint: "/api/hello",
    callback: async (req, res) => {
        res.json({ message: "hello world!" })
    }
});