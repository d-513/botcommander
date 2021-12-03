import Discord from "discord.js";
import fs from "fs/promises";
import map from "p-map";

export abstract class LanguageManager {
  constructor() {}
  async loadLanguagesIn(langDir: string) {
    let languageFiles = await fs.readdir(langDir);
    languageFiles = languageFiles.filter((language) =>
      language.endsWith(".json")
    );
    // create an object with all language files
    const languages = await map(languageFiles, async (language: string) => {
      const languageFile = await fs.readFile(`${langDir}/${language}`, "utf8");
      return JSON.parse(languageFile);
    });
    console.log(languages);
  }
  abstract setUserLanguage(user: Discord.User, language: string): Promise<void>;
  abstract getUserLanguage(user: Discord.User): Promise<string>;
}
