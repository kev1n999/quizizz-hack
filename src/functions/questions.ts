import { Page } from "puppeteer";
import { getAnswer } from "utils/answer";
import { sleep } from "utils/sleep";

export async function questionsResolvable(page: Page, exerciceUrl: string) {
  try {
    let allOptions: Map<number, string> = new Map<number, string>();

    await page.goto(exerciceUrl);
    await page.keyboard.press("Escape");

    await sleep(3000);
    await page.waitForSelector('button[data-cy="start-solo-game"]', {
      timeout: 15000,
    });

    await page.click('button[data-cy="start-solo-game"]');
    for (let i = 0; i < 20; i++) {
      const questionContainer = await page.waitForSelector(
        'div[id="questionText"]'
      );

      const questionText = await questionContainer?.evaluate(
        (d) => d.textContent
      );
      console.log(`====== Descrição da Atividade ======`.yellow);
      console.log(`\n${questionText}`.green);

      const options = await page.evaluate(() => {
        const containers = Array.from(document.querySelectorAll("div")).filter(
          (div) => div.id.includes("option")
        );

        return containers.map((div) => ({
          text: div.textContent,
        }));
      });

      for (let i = 0; i < options.length; i++) {
        allOptions.set(i, options[i].text);
      }

      if (allOptions.size > 0) {
        console.log(`\n====== ALTERNATIVAS ======`.yellow);
        allOptions.forEach((v, i) => {
          console.log(`${i} - ${v}`.green);
        });
      }

      console.log(`\n====== RESPOSTA IDENTIFICADA ======\n`.yellow);
      const answer = await getAnswer(questionText!, allOptions);

      console.log(`${answer}`.green);

      await page.evaluate((answer) => {
        const normalizedAnswer = answer.trim().toLowerCase();

        const correctOption = Array.from(
          document.querySelectorAll("div[id^='option']")
        ).find((div) =>
          div.textContent?.trim().toLowerCase().includes(normalizedAnswer)
        );

        if (correctOption) {
          (correctOption as HTMLElement).click();
        } else {
          console.warn("Nenhuma opção correspondente encontrada:", answer);
        }
      }, answer);

      console.log(`\n====== OPÇÃO CLICADA ======\n`.yellow);
    }
  } catch (err) {
    console.error(`[ERROR!]\n${err}`.red);
  }
}
