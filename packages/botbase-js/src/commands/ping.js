const { Command } = require("@botcommanderjs/libcommander");
const { CommandInteraction } = require("discord.js");
const path = require("path");
console.log(`${path.basename(__filename)} loaded`);
module.exports = class PingCommand extends Command {
  constructor() {
    super();
    this.data = {
      name: "ping",
      description: "checks the bot ping",
    };
  }

  /**
   * This is done so that you get intellisense from your IDE
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    return interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  }
};
