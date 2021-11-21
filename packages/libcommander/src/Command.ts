import {
  ApplicationCommandData,
  CommandInteraction,
  PermissionString,
} from "discord.js";

export abstract class Command {
  public abstract data: ApplicationCommandData;
  public abstract guildId?: string;
  public abstract permissionRequired?: PermissionString;

  public abstract evalPermissions?(
    interaction: CommandInteraction
  ): Promise<boolean>;
  public abstract execute(interaction: CommandInteraction): Promise<void>;
}
