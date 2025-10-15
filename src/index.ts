import "dotenv/config";
import "colors";
import puppeteer from "puppeteer";
import { loginWithGoogle } from "./functions/login";
import { ascii } from "utils/ascii";
import { loginCredentials } from "prompts/loginCredentials";
import { exercicesUrl } from "prompts/exercise";
import { questionsResolvable } from "functions/questions";

(async function main() {
  ascii();

  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  const credentials = await loginCredentials();
  const exerciceUrl = await exercicesUrl();

  ascii();

  await loginWithGoogle(page, credentials.email, credentials.password);
  await questionsResolvable(page, exerciceUrl);
})();
