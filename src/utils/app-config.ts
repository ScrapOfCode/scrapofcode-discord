import * as dotenv from 'dotenv';

type AppConfigDefault = {
    prismic: {
        repositoryName: string,
    }
    discord: {
        token: string,
        clientId: string
    }
}

dotenv.config();
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, PRISMIC_REPOSITORY_NAME } = process.env;

export default function getAppConfig(): AppConfigDefault{
    return {
        prismic: {
            repositoryName: PRISMIC_REPOSITORY_NAME ?? "",
        },
        discord: {
            token: DISCORD_TOKEN ?? "",
            clientId: DISCORD_CLIENT_ID ?? ""
        }
    } as AppConfigDefault
}
