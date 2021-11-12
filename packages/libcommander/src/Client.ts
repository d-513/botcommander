import Discord from "discord.js";
import fs from "fs-extra";
import map from "p-map";
import { Command } from "./lib";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CommanderOptions } from "./CommanderOptions";

export class Client extends Discord.Client {
  commands: Command[];
  slashRest: REST;
  clientId: string;
  ownerId: string;
  botOwner: Discord.User;
  constructor(djsoptions: Discord.ClientOptions, options: CommanderOptions) {
    super(djsoptions);
    this.commands = [];
    this.token = options.token;
    this.clientId = options.clientId;
    this.slashRest = new REST({ version: "9" }).setToken(this.token);
    if (options.ownerId) {
      this.ownerId = options.ownerId;
      this.fetchBotOwner();
    }
  }

  async loadCommands(commandDir: string) {
    let commandFiles = await fs.readdir(commandDir);
    commandFiles = commandFiles.filter(
      (command) => command.endsWith(".js") || command.endsWith(".ts")
    );
    await map(commandFiles, async (command) => {
      const CommandClass = await import(`${commandDir}/${command}`);
      const commandInst = new CommandClass.default();
      console.log(`Loaded ${command}`);
      this.commands.push(commandInst);
    });
  }

  private async fetchBotOwner() {
    const owner = await this.users.fetch(this.ownerId).catch(() => {});
    if (!owner) return;
    this.botOwner = owner;
  }

  private async refreshSlash(
    commands: Discord.ApplicationCommandData[],
    guildId?: string
  ) {
    if (guildId) {
      await this.slashRest.put(
        Routes.applicationGuildCommands(this.clientId, guildId),
        { body: commands }
      );
    } else {
      await this.slashRest.put(Routes.applicationCommands(this.clientId), {
        body: commands,
      });
    }
  }

  public registerCommands() {
    const commands: Discord.ApplicationCommandData[] = [];

    this.commands.forEach((command) => {
      commands.push(command.data);
    });

    return this.refreshSlash(commands);
  }

  public registerCommandsForGuild(guildId: string) {
    const commands: Discord.ApplicationCommandData[] = [];

    this.commands.forEach((command) => {
      commands.push(command.data);
    });

    return this.refreshSlash(commands, guildId);
  }

  public startCommandListener() {
    this.on("interactionCreate", (interaction) => {
      if (!interaction.isCommand()) return;
      const command = this.commands.find(
        (cmd) => cmd.data.name === interaction.commandName
      );
      if (!command) return;
      command.execute(interaction).catch((err) => {
        interaction.reply(
          `An error has occured: ${err}.` + this.botOwner
            ? `Please contact ${this.botOwner.tag}`
            : ""
        );
      });
    });
  }
}
