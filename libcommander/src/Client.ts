import Discord from "discord.js";
import { Command } from "./lib";
import fs from "fs-extra";
import map from "p-map";

export class Client extends Discord.Client {
  commands: Command[];
  constructor(options: Discord.ClientOptions) {
    super(options);
    this.commands = [];
  }

  async loadCommands(commandDir: string = "./commands/") {
    let commands = await fs.readdir(`${commandDir}`);
    commands = commands.filter(
      (command) => command.endsWith(".js") || command.endsWith(".ts")
    );
    await map(commandDir, async (command) => {
      this.commands.push(await import(`${commandDir}${command}`));
    });
  }
}
