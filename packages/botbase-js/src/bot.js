require("dotenv").config();
const { Client } = require("@botcommanderjs/libcommander");
const path = require("path");

const bot = new Client(
  { intents: ["GUILD_INTEGRATIONS", "GUILDS", "GUILD_MEMBERS"] },
  {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    ownerId: process.env.OWNER_ID,
  }
);

async function main() {
  await bot.loadCommands(path.join(__dirname, "commands"));
  if (process.env.DEVMODE && process.env.TEST_GUILD_ID) {
    await bot.registerCommandsForGuild(process.env.TEST_GUILD_ID);
  } else {
    await bot.registerCommands();
  }
  bot.once("ready", () => {
    console.log(`Discord logged in as user ${bot?.user?.tag}`);
  });
  bot.startCommandListener();

  bot.login();
}

main();
