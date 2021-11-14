const { description } = require("../../package");

module.exports = {
  lang: "en-US",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "BotCommander",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  theme: "yuu",
  themeConfig: {
    yuu: {
      defaultDarkTheme: true,
      // defaultColorTheme: "green",
    },
    repo: "https://github.com/dada513/botcommander",
    editLinks: false,
    docsDir: "",
    editLinkText: "",
    lastUpdated: false,
    nav: [
      {
        text: "Home",
        link: "/",
      },
      {
        text: "Guide",
        link: "/guide/",
      },
      {
        text: "Technical Documentation",
        link: "https://botcommander.d513.space/types/",
      },
      {
        text: "discord.js",
        link: "https://discord.js.org",
      },
    ],
    sidebar: [
      {
        title: "Guide",
        sidebarDepth: 3,
        path: "/guide/",
        collapsable: false,
        children: [
          {
            title: "Creating your bot",
            collapsable: false,
            path: "/guide/creating-bot/",
            children: [
              "/guide/creating-bot/",
              "/guide/creating-bot/setup.md",
              "/guide/creating-bot/commands.md",
            ],
          },
        ],
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    "vuepress-plugin-auto-sidebar",
  ],
};
