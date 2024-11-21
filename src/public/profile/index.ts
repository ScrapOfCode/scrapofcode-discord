import {getAppLauncher} from "../index";

type ProfileType = "user" | "server";
type Profile<T> = {
    id: string,
    name: string,
    description: string
} & T;

export type UserProfile = Profile<{
    username: string,
    avatarUrl: string,
    createdAt: Date
}>;

export type ServerProfile = Profile<{
    serverName: string,
    iconUrl: string,
    membersOnline: number,
    members: number
}>;

export const getProfile = async (type: ProfileType, id: string) => {
    const app = getAppLauncher;
    const discordClient = app.getDiscordClient();

    const options = [
        {type: "user", response: async () => {
            const userById = await discordClient.users.fetch(id);

            return {
                id: userById.id,
                username: userById.username,
                name: "Reaching for a user",
                description: "This will get you target user profile",
                avatarUrl: userById.avatarURL() ?? "",
                createdAt: userById.createdAt
            } satisfies UserProfile;
        }},
        {type: "server", response: async () => {
            const server = await discordClient.guilds.fetch(id);

            async function getOnlineMembers() {
                const listMembers = await server.members.list();

                return listMembers
                    .filter((member) =>
                        member.presence?.status === "online" ||
                        member.presence?.status === "idle" ||
                        member.presence?.status === "dnd"
                    )
                    .size;
            }

            return {
                id: server.id,
                name: "Reaching for a server",
                description: "This will get you target server profile",
                serverName: server.name,
                iconUrl: "",
                members: server.memberCount,
                membersOnline: await getOnlineMembers()
            } satisfies ServerProfile;
        }}
    ];

    return await options.find((opt) => opt.type === type)?.response();
}

