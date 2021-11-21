import { Command } from "@botcommanderjs/libcommander";
import {
  ApplicationCommandData,
  CommandInteraction,
  PermissionString,
} from "discord.js";
import path from "path";
console.log(`${path.basename(__filename)} loaded`);
export default class PingCommand implements Command {
  data: ApplicationCommandData;
  guildId?: string;
  permissionRequired?: PermissionString;
  constructor() {
    this.data = {
      name: "ping",
      description: "checks the bot ping",
    };
  }

  async execute(interaction: CommandInteraction) {
    return interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  }
}
