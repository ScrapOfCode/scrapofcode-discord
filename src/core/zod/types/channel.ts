import {z} from "zod";

export const ChannelSchema = z.object({
    id: z.string()
});