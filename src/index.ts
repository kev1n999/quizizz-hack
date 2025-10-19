import "dotenv/config";
import "colors";
import puppeteer from "puppeteer";
import { loginWithGoogle } from "./functions/login";
import { ascii } from "utils/ascii";
import { loginCredentials } from "prompts/loginCredentials";
import { exercicesUrl } from "prompts/exercise";
import { questionsResolvable } from "functions/questions";
import { confirmLogin } from "prompts/confirmLogin";
import boxen from "boxen";
import chalk from "chalk";

(async function main() {
  ascii();

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  const credentials = await loginCredentials();

  ascii();

  await loginWithGoogle(page, credentials.email, credentials.password);
  const isConfirmedLogin = await confirmLogin();

  if (isConfirmedLogin) {
    const exerciceUrl = await exercicesUrl();
    await questionsResolvable(page, exerciceUrl);
  } else {
    console.error(
      boxen(
        chalk.bold.red(
          "[Não foi prosseguir com a automação, você não confirmou o seu login corretamente!]"
        ),
        {
          padding: 0,
          margin: 0,
          borderStyle: "round",
          borderColor: "red",
        }
      )
    );
  }
})();
