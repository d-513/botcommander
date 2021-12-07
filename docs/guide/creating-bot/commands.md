# Creating commands

Make a file in your commands folder. By default this will be `src/commands`.

### Basic command

```js
const { Command } = require("@botcommanderjs/libcommander");
const { CommandInteraction } = require("discord.js");
module.exports = class PingCommand esxtends Command {
  constructor() {
    super();
    this.data = {
      name: "ping",
      description: "checks the bot ping",
    };
  }

  /**
   * KEEP THIS, this is so that you get autocomplete from your editor
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    return interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  }
};
```

The Command is a JavaScript [Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) which uses the (extend)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends] keyword to implement
