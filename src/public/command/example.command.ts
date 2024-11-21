import createCommand from "../../core/command";
import {z} from "zod";

export default createCommand("example", "an example command", async (ctx, req) => {
    await req.createEndpoint(
        "test", "hello, world",
        z.object({ username: z.string(), password: z.string() }),
        async (args) => {

        }
    );

    await req.createEndpoint(
        "test2", "hello, world 2",
        z.object({ username: z.string(), password: z.string() }),
        async (args) => {

        }
    );
});