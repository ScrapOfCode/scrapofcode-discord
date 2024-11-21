import {z} from "zod";
import {UserSchema} from "./user";
import {RoleSchema} from "./role";
import {ChannelSchema} from "./channel";

export const MentionableSchema = z.union([
    UserSchema,
    RoleSchema,
    ChannelSchema
]);