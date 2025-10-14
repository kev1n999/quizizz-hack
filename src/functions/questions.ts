import { Page } from "puppeteer";

export async function questionsResolvable(page: Page, exerciceUrl: string) {
  try {
    await page.goto(exerciceUrl);
    const resp = await page.waitForResponse(exerciceUrl);

    if (resp.status() === 200) {
      await page.evaluate(() => {
        const startGameButton = Array.from(
          document.querySelectorAll("button")
        ).find((btn) => btn.className.includes("play"));

        startGameButton?.click();
      });
    }
  } catch (err) {
    console.error(`[ERROR!]\n${err}`.red);
  }
}
