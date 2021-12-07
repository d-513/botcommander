import { Command } from "@botcommanderjs/libcommander";
import { CommandInteraction } from "discord.js";
import path from "path";
console.log(`${path.basename(__filename)} loaded`);
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
