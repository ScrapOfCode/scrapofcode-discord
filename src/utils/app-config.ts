import * as dotenv from 'dotenv';

export type AppConfigDefault = {
    database: {
        url: string,
    }
    prismic: {
        repositoryName: string,
    }
    discord: {
        token: string,
        clientId: string
    }
}

dotenv.config();
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, PRISMIC_REPOSITORY_NAME, POSTGRES_URL } = process.env;

export default function getAppConfig(): AppConfigDefault{
    return {
        prismic: {
            repositoryName: PRISMIC_REPOSITORY_NAME ?? "",
        },
        discord: {
            token: DISCORD_TOKEN ?? "",
            clientId: DISCORD_CLIENT_ID ?? ""
        },
        database: {
            url: POSTGRES_URL ?? ""
        }
    } as AppConfigDefault
}
