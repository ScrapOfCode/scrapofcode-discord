import createCommand from "../../core/command";
import {z} from "zod";
import {UserSchema} from "../../core/zod/types/user";
import {RoleSchema} from "../../core/zod/types/role";
import {getProfile, ServerProfile} from "../profile";
import {EmbedBuilder} from "discord.js";


export default createCommand("profile", "Command that helps with a user profile", async (ctx, req) => {
    await req.createEndpoint("server", "It shows your profile",
        z.object({}),
        async (interaction, args) => {
            const serverId = ctx.env.discord.serverId;
            const serverProfile = await getProfile("server", serverId) as ServerProfile;

            if(serverProfile){
                const embed = new EmbedBuilder()
                    .setTitle(serverProfile.name)
                    .setDescription(serverProfile.description)
                    .addFields(
                        { name: "Server Name", value: serverProfile.serverName },
                        { name: "Members online", value: String(serverProfile.membersOnline) },
                        { name: "Members", value: String(serverProfile.members) }
                    );

                await interaction.reply({ embeds: [ embed ] });
            }
        }
    );
});