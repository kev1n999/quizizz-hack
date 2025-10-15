import { Page } from "puppeteer";
import { getAnswer } from "utils/answer";
import { ascii } from "utils/ascii";
import { sleep } from "utils/sleep";

export async function questionsResolvable(page: Page, exerciceUrl: string) {
  try {
    let allOptions: Map<number, string> = new Map<number, string>();

    await page.goto(exerciceUrl);
    await page.keyboard.press("Escape");

    await sleep(3000);
    const startGame = await page.waitForSelector(
      'button[data-cy="start-solo-game"]',
      {
        timeout: 15000,
      }
    );

    await startGame?.click();

    const totalQuestions = await page.waitForSelector(
      'span[data-cy="total-question-number"]'
    );
    const totalNumberQuestions = await totalQuestions?.evaluate(
      (el) => el.innerText
    );

    console.log(`Total de questões: ${totalNumberQuestions}`);

    for (let i = 0; i < Number(totalNumberQuestions); i++) {
      const questionContainer = await page.waitForSelector(
        'div[id="questionText"]',
        { timeout: 3000 }
      );

      const questionText = await questionContainer?.evaluate(
        (d) => d.textContent
      );
      console.log(
        `
--------------------------
| DESCRIÇÂO DA ATIVIDADE |
--------------------------       `.yellow
      );
      console.log(`\n- ${questionText}`.green);

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
        console.log(
          `
----------------------------
| ALTERNATIVAS DISPONÍVEIS |
----------------------------         
        `.yellow
        );
        allOptions.forEach((v, i) => {
          console.log(`${i} - ${v}`.green);
        });
      }
      const answer = await getAnswer(questionText!, allOptions);

      console.log(
        `\n
------------------------------------------
| RESPOSTA IDENTIFICADA: ${answer.green} |
------------------------------------------
        \n`.yellow
      );

      await page.evaluate((answer) => {
        const correctOption = Array.from(
          document.querySelectorAll("div")
        ).find((div) => div.innerText.trim().toLowerCase() === answer.trim().toLowerCase())

        correctOption?.click();
      }, answer);

      sleep(2000);
      ascii();
    }
  } catch (err) {
    console.error(`[ERROR!]\n${err}`.red);
  }
}
