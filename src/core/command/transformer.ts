import {ZodBoolean, ZodNumber, ZodObject, ZodString, ZodType} from "zod";
import {Channel, Role, SlashCommandSubcommandBuilder, User} from "discord.js";
import {UserSchema} from "../zod/types/user";
import {ChannelSchema} from "../zod/types/channel";
import {RoleSchema} from "../zod/types/role";
import {MentionableSchema} from "../zod/types/mentionable";

type ArgumentTypeDefinitionVariants = "string" | "number" | "boolean" | "mentionable" | "user" | "channel" | "role";
type ArgumentTypeDefinitionInput = {
    string: { value: string },
    number: { value: number },
    boolean: { value: boolean },
    mentionable: { value: User | Role | Channel | null };
    user: { value: User | null};
    channel: { value: Channel | null };
    role: { value: Role | null };
}

type ArgumentTypeDefinition = ArgumentTypeDefinitionInput[ArgumentTypeDefinitionVariants];

export class Transformer<T extends Record<string, any>> {
    private subCommandInstance: SlashCommandSubcommandBuilder;
    private arguments: Set<[string, ArgumentTypeDefinition]>;
    private readonly zodType: ZodType<T>;


    constructor(schema: ZodType<T>, subCommandInstance: SlashCommandSubcommandBuilder) {
        this.zodType = schema;
        this.arguments = new Set<[string, ArgumentTypeDefinition]>();
        this.subCommandInstance = subCommandInstance;
    }

    public addOptions(){
        if (this.zodType instanceof ZodObject) {
            const object = this.zodType;
            const entries = Object.entries(this.zodType.shape);
            entries.forEach(([key, _]) => {
                const propertyName = key;
                const def = object.shape[propertyName];

                const matchTypes = [
                    {
                        condition: () => def === ZodString, callback: () => {
                        this.subCommandInstance.addStringOption((opt) => {
                            return opt
                                .setName(propertyName)
                                .setDescription("Some description");
                        });
                    }},
                    {
                        condition: () => def === ZodNumber, callback: () => {
                        this.subCommandInstance.addNumberOption((opt) => {
                            return opt
                                .setName(propertyName)
                                .setDescription("Some description");
                        });
                    }},
                    {
                        condition: () => def === ZodBoolean, callback: () => {
                        this.subCommandInstance.addBooleanOption((opt) => {
                            return opt
                                .setName(propertyName)
                                .setDescription("Some description");
                        });
                    }},
                    {
                        condition: () => def === UserSchema, callback: () => {
                        this.subCommandInstance.addUserOption((opt) => {
                            return opt
                                .setName(propertyName)
                                .setDescription("Some description");
                        });
                    }},
                    {
                        condition: () => def === ChannelSchema, callback: () => {
                        this.subCommandInstance.addChannelOption((opt) => {
                            return opt
                                .setName(propertyName)
                                .setDescription("Some description");
                        });
                    }},
                    {
                        condition: () => def === RoleSchema, callback: () => {
                            this.subCommandInstance.addRoleOption((opt) => {
                                return opt
                                    .setName(propertyName)
                                    .setDescription("Some description");
                            });
                        }},
                    {
                        condition: () => def === MentionableSchema, callback: () => {
                            this.subCommandInstance.addMentionableOption((opt) => {
                                return opt
                                    .setName(propertyName)
                                    .setDescription("Some description");
                            });
                    }}
                ];

                matchTypes.forEach((matcher) => {
                    matcher.condition() ? matcher.callback() : () => {}
                });
            });
        }
    }
}