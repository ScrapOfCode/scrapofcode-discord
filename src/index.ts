import { Client, IntentsBitField } from "discord.js";
import getAppConfig from "./app-config";
import { exampleCommand } from "./command/example";
import express from 'express'


export const client = new Client({ intents: [IntentsBitField.Flags.Guilds] });
const appConfig = getAppConfig();

function registerSlashCommands(){
    exampleCommand();
}
const app = express()

app.get('/', (req, res) => {
  res.json({ message: "Hello, scrapofcode!" });
})

app.listen(3000)

registerSlashCommands();

client.login(appConfig.discord.token);