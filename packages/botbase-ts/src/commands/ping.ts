import { Command } from "libcommander";
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class PingCommand extends Command {
  constructor() {
    super();
    this.data = {
      name: "ping",
      description: "checks the bot ping",
    };
  }

  async execute(interaction: CommandInteraction) {
    return interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  }
}
