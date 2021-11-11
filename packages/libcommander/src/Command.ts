import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
type executeFunction = (interaction: Interaction) => Promise<void>;

export class Command {
  data: SlashCommandBuilder;
  guildId?: string;
  execute: executeFunction;
}
