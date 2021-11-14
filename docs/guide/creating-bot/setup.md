# Initial setup

Open the `.env` file in your directory and edit it accordingly.
If you followed the discord.js bot setup guide in the getting started doc, you should have a bot account ready.

If you do not know how to get your guild id, please follow [this guide](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)  
Get to discord developer portal [here](https://discord.com/developers/applications/)

::: tip
Make sure your bot was invited with the `application.commands` and `bot` scopes, otherwise you will get a permission error
:::

```
CLIENT_ID= # client ID from your bot developer dashboard (general information -> application id)
TOKEN= # bot token from the dashboard (bot -> token -> copy)
DEVMODE=true # true when you're developing the bot, otherwise false
TEST_GUILD_ID= # set to the guild ID of your test server. (getting IDs)
```
