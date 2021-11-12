import { ApplicationCommandData } from "discord.js";
import { Interaction } from "discord.js";

export abstract class Command {
  // data: SlashCommandBuilder;
  data: ApplicationCommandData;
  guildId?: string;

  abstract execute(interaction: Interaction): Promise<void>;
}
