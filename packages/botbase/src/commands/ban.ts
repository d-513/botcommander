import { Command } from "@botcommanderjs/libcommander";
import { CommandInteraction } from "discord.js";
import path from "path";
console.log(`${path.basename(__filename)} loaded`);
export default class BanCommand extends Command {
  constructor() {
    super();
    this.permissionRequired = "BAN_MEMBERS";
    this.data = {
      name: "ban",
      defaultPermission: false,
      description: "bans a user",
      // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
      options: [
        {
          type: 6, // user
          name: "user",
          description: "user to ban",
          required: true,
        },
        {
          type: 3,
          name: "reason",
          description: "reason for the ban",
          required: false,
        },
      ],
    };
  }

  public async execute(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const authorMember = interaction.member;
    const userToBan = interaction.options.getUser("user");
    if (!userToBan) throw "up";
    const memberToBan = await interaction.guild?.members.fetch(userToBan.id);
    if (!memberToBan) throw "up";
    if (
      authorMember.roles.highest.position <
        memberToBan?.roles.highest.position &&
      interaction.guild?.ownerId !== authorMember.id
    ) {
      return interaction.reply({
        content: `Your role is lower than the user you are trying to ban's - no permission`,
        ephemeral: true,
      });
    }

    await memberToBan.ban({
      reason: `Banned by ${interaction.user.tag} (${interaction.user.id}) for ${
        interaction.options.getString("reason") || `no reason provided`
      }`,
    });

    return interaction.reply(`Done, banned ${userToBan.tag}`);
  }
}
