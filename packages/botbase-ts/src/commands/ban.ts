import { Command } from "libcommander";
import { CommandInteraction } from "discord.js";

export default class BanCommand extends Command {
  constructor() {
    super();

    this.data = {
      name: "ban",
      defaultPermission: false,
      description: "bans a user",
      options: [
        {
          type: "USER",
          name: "user",
          description: "user to ban",
          required: true,
        },
      ],
    };
  }

  async execute(interaction: CommandInteraction) {
    return interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  }
}
