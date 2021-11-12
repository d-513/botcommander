/*
  BotCommander Typescript template
  MIT licensed
*/
import {
  Client,
  CommanderOptions,
  areValidOptions,
} from "@botcommanderjs/libcommander";
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
const bot = new Client(
  { intents: ["GUILD_INTEGRATIONS", "GUILDS", "GUILD_MEMBERS"] },
  options
);

async function main() {
  await bot.loadCommands(path.join(__dirname, "commands"));

  if (process.env.DEVMODE && process.env.TEST_GUILD_ID) {
    await bot.registerCommandsForGuild(process.env.TEST_GUILD_ID);
  } else {
    await bot.registerCommands();
  }
  // await bot.purgeCommands(process.env.TEST_GUILD_ID);
  bot.once("ready", () => {
    console.log(`Discord logged in as user ${bot?.user?.tag}`);
  });
  bot.startCommandListener();

  bot.login();
}

main();
