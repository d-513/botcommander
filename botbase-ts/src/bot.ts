import { Client, CommanderOptions } from "libcommander";
import dotenv from "dotenv";

dotenv.config();
const config: CommanderOptions = {};

const bot = new Client({ intents: ["GUILD_INTEGRATIONS"] });
