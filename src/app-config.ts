import * as dotenv from 'dotenv';

type AppConfigDefault = {
    discord: {
        token: string,
        clientId: string
    }
}

dotenv.config();
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

export default function getAppConfig(): AppConfigDefault{
    return {
        discord: {
            token: DISCORD_TOKEN ?? "",
            clientId: DISCORD_CLIENT_ID ?? ""
        }
    } as AppConfigDefault
}
