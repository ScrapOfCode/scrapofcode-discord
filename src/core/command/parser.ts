import {ZodObject, ZodString, ZodType, infer} from "zod";
import {CommandInteraction} from "discord.js";
import {UserSchema} from "../zod/types/user";

export const parseSchema = <T extends Record<string, string>>(
    interaction: CommandInteraction,
    schema: ZodType<T>
) => {
    const rawSchema: Record<string, any> = {};

    if(schema instanceof ZodObject) {
        for(const key of Object.keys(schema.shape)){
            const option = interaction.options.get(key, false);

            if (!option) {
                throw new Error(`Missing required option: ${key}`);
            }

            console.log("received " + key  + " type is " + option.type);

            switch(option.type) {
                case 3: {
                    rawSchema[key] = option.value as string;
                    break;
                }

                case 4 & 10: {
                    rawSchema[key] = option.value as number;
                    break;
                }

                case 5: {
                    rawSchema[key] = option.value as boolean;
                    break;
                }

                case 6 & 7: {
                    rawSchema[key] = { id: option.value };

                    break;
                }

                case 8: {
                    rawSchema[key] = { id: option.value };

                    break;
                }
            }
        }
        return schema.parse(rawSchema);
    }

    return null;
}