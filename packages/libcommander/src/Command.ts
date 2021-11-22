import {
  ApplicationCommandData,
  CommandInteraction,
  PermissionString,
} from "discord.js";

export abstract class Command {
  data: ApplicationCommandData;
  guildId?: string;
  permissionRequired?: PermissionString;

  evalPermissions?(interaction: CommandInteraction): Promise<boolean>;
  public abstract execute(interaction: CommandInteraction): Promise<void>;
}
