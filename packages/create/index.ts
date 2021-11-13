import { downloadPackage } from "npm-pkg-downloader";
import { promisify } from "util";
import { exec as execCB } from "child_process";
import inquirer from "inquirer";
import fs from "fs/promises";
import chalk from "chalk";
import ora from "ora";
const exec = promisify(execCB);
interface Answers {
  dir: string;
  name: string;
  author?: string | null;
  lang: "TypeScript" | "JavaScript";
  useGit: boolean;
  npmClient: "npm" | "yarn";
  confirm: boolean;
}

const info = (msg: string) =>
  console.log(chalk.black.bgBlue("    INFO    "), msg);
const success = (msg: string) =>
  console.log(chalk.black.bgGreen("   SUCCESS  "), msg);

async function main() {
  const data: Answers = await inquirer.prompt([
    {
      type: "input",
      message: "what directory to use?",
      name: "dir",
      default: "discord-bot",
      async validate(input) {
        let correct = false;
        try {
          await fs.access(input);
        } catch (_) {
          correct = true;
        }
        return correct ? true : "Directory already exists";
      },
    },
    {
      type: "input",
      name: "name",
      message: "name of your bot?",
      default: "discord-bot",
    },
    {
      type: "input",
      name: "author",
      message: "your name",
    },
    {
      type: "list",
      name: "lang",
      message: "what language to use?",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "confirm",
      name: "useGit",
      message: "use Git Versioning?",
      default: false,
    },
    {
      type: "list",
      name: "npmClient",
      message: "what NPM client to use?",
      choices: ["npm", "yarn"],
    },
    {
      name: "confirm",
      type: "confirm",
    },
  ]);
  if (!data.confirm) {
    console.log(chalk.red("terminating..."));
    process.exit(2);
  }
  await fs.appendFile(
    "./.create-botcommander.log",
    [
      `\nNode Version: ${process.version}`,
      `data: '${JSON.stringify(data)}'`,
    ].join("\n")
  );
  const spinner = ora("Downloading template...").start();

  await downloadPackage(
    `@botcommanderjs/botbase-${data.lang === "TypeScript" ? "ts" : "js"}`,
    data.dir
  );
  const execOpts = { cwd: data.dir };
  let gitRemote = null;
  if (data.useGit) {
    const gitV = await exec("git version", execOpts);
    fs.appendFile("./.create-botcommander.log", gitV.stdout);
    fs.appendFile("./.create-botcommander.log", gitV.stderr);

    const init = await exec("git init", execOpts);
    fs.appendFile("./.create-botcommander.log", init.stdout);
    fs.appendFile("./.create-botcommander.log", init.stderr);
  }
  spinner.stop();
  info(`Using ${data.npmClient}`);
  spinner.color = "green";
  spinner.text = "Downloading dependencies";
  spinner.start();
  if (data.npmClient === "npm") {
    const res = await exec("npm install", execOpts);
    fs.appendFile("./.create-botcommander.log", res.stdout);
    fs.appendFile("./.create-botcommander.log", res.stderr);
  } else if (data.npmClient === "yarn") {
    const res = await exec("yarn", execOpts);
    fs.appendFile("./.create-botcommander.log", res.stdout);
    fs.appendFile("./.create-botcommander.log", res.stderr);
  }

  const packageJsonRaw = await fs.readFile(
    `./${data.dir}/package.json`,
    "utf-8"
  );
  const packageJson = JSON.parse(packageJsonRaw);
  data.author ? (packageJson.author = data.author) : delete packageJson.author;
  delete packageJson.license;
  gitRemote
    ? (packageJson.repository = gitRemote)
    : delete packageJson.repository;
  delete packageJson.gitHead;
  packageJson.name = data.name;

  await fs.writeFile(
    `./${data.dir}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );

  // cleanup files that might have ended up in the template for no apparent reason
  await fs.rm(`./${data.dir}/LICENSE`, { force: true });
  await fs.rm(`./${data.dir}/yarn.lock`, { force: true });
  await fs.rm(`./${data.dir}/yarn-error.log`, { force: true });
  await fs.rm(`./${data.dir}/package-lock.json`, { force: true });
  await fs.cp(`./${data.dir}/.env.example`, `./${data.dir}/.env`);
  spinner.stop();
  success("Project bootstrapped");
  info(
    "To start working on your bot, fill out the required values in the .env file, and"
  );
  info(
    `start it for development with '${
      data.npmClient === "npm" ? "npm run dev" : "yarn dev"
    }'`
  );
}

main();
