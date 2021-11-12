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

      this.commands.push(commandInst);
    });
  }

  private async fetchBotOwner() {
    if (!this.ownerId) return;
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

  public purgeCommands(guildId?: string) {
    if (guildId) {
      return this.slashRest.put(
        Routes.applicationGuildCommands(this.clientId, guildId),
        { body: {} }
      );
    } else {
      return this.slashRest.put(Routes.applicationCommands(this.clientId), {
        body: {},
      });
    }
  }

  public startCommandListener() {
    this.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;
      const command = this.commands.find(
        (cmd) => cmd.data.name === interaction.commandName
      );
      if (!command) return;
      if (command.permissionRequired) {
        const member = await interaction.guild?.members.fetch(
          interaction.user.id
        );

        if (!member?.permissions.has(command.permissionRequired)) {
          return interaction.reply({
            content: `You need the ${command.permissionRequired} permission to use this command.`,
            ephemeral: true,
          });
        }
      }
      if (command.evalPermissions) {
        const hasPermissions = await command.evalPermissions(interaction);
        if (!hasPermissions)
          return interaction.reply({
            content: "You don't have permission to use this command!",
            ephemeral: true,
          });
      }
      command.execute(interaction).catch((err) => {
        let str = "An error has occured";
        if (this.botOwner && this.botOwner.tag) {
          str += `\nPlease contact ${this.botOwner.tag} with the following information: ${err}`;
        } else {
          str += `\n${err}`;
        }
        return interaction.reply({ content: str, ephemeral: true });
      });
    });
  }
}
