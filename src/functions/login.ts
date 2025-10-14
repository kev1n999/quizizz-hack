import "puppeteer";
import { constants } from "config";
import { Page } from "puppeteer";
import { sleep } from "utils/sleep";

export async function loginWithGoogle(
  page: Page,
  email: string,
  password: string
) {
  try {
    await page.goto(constants.loginUrl);

    await page.evaluate(() => {
      const loginBtn = Array.from(document.querySelectorAll("div")).find(
        (btn) => btn.textContent.toLowerCase() === "continue with google"
      );

      loginBtn?.click();
    });

    await sleep(3000);
    await page.type('input[type="email"]', email);
    await page.keyboard.press("Enter");

    await sleep(3000);
    await page.type('input[type="password"]', password);
    await page.keyboard.press("Enter");
  } catch (err) {
    console.error(`[ERROR!]\n${err}`.red);
  }
}
