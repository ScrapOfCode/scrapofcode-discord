import { GatewayIntentBits, IntentsBitField } from "discord.js";
import getAppConfig from "./utils/app-config";
import Client from "./utils/discord/client";
import { withExpressModule } from "./api";
import { withCommandsModule } from "./command";

const appConfig = getAppConfig();

export const client: Client = Client.of(appConfig.discord.token, { intents: [
    GatewayIntentBits.Guilds,
    IntentsBitField.Flags.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent 
]});

withExpressModule(client);
withCommandsModule(client);

client.init();