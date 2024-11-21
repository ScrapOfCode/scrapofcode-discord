import { configDotenv } from "dotenv";

export type EnvironmentSchema = {
    discord: {
        token: string,
        clientId: string,
        serverId: string
    },
    prismicRepositoryName: string,
    postgresUrl: string
};

export function getEnvironment(){
    configDotenv();

    return { 
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            serverId: process.env.DISCORD_SERVER_ID as string,
            token: process.env.DISCORD_TOKEN as string
        },
        postgresUrl: process.env.POSTGRES_URL as string,
        prismicRepositoryName: process.env.PRISMIC_REPOSITORY_NAME as string
    } satisfies EnvironmentSchema 
}
