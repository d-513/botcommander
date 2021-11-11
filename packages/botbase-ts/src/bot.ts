/*
  BotCommander Typescript template
  MIT licensed
*/
import { Client, CommanderOptions, areValidOptions } from "libcommander";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

/*
  What we're basically doing here is making sure the options are valid before starting the bot.
  This is called a type guard in typescript
  We use the areValidOptions utility from libcommander to acomplish that
*/

const optionsUnsafe = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  ownerId: process.env.OWNER_ID,
};

if (!areValidOptions(optionsUnsafe)) {
  console.log(`Token or clientid not specified - please see docs`);
  process.exit(0);
}

const options: CommanderOptions = optionsUnsafe;
const bot = new Client({ intents: ["GUILD_INTEGRATIONS"] }, options);

async function Main() {
  await bot.loadCommands(path.join(__dirname, "commands"));
  await bot.registerCommands();
  //   For dev & testing use guild based!
  //   await bot.registerCommandsForGuild("123467")
  bot.startCommandListener();
}

Main();
