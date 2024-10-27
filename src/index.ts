import { ActivityType, Client, GatewayIntentBits, IntentsBitField } from "discord.js";
import getAppConfig from "./utils/app-config";
import { exampleCommand } from "./command/example";
import express from 'express'
import { loadApiRoutes } from "./api";
import { articleCommand } from "./command/article";


export const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  IntentsBitField.Flags.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent 
]});


function registerSlashCommands(){
  exampleCommand();
  articleCommand();
}

const appConfig = getAppConfig();
const app = express();

loadApiRoutes(app);

app.listen(3000);

registerSlashCommands();
client.login(appConfig.discord.token);