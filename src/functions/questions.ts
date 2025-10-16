import boxen from "boxen";
import chalk from "chalk";
import { Page } from "puppeteer";
import { getAnswer } from "utils/answer";
import { ascii } from "utils/ascii";
import { sleep } from "utils/sleep";

export async function questionsResolvable(page: Page, exerciceUrl: string) {
  try {
    let allOptions: Map<number, string> = new Map<number, string>();

    ascii();

    await page.goto(exerciceUrl);
    await page.keyboard.press("Escape");

    await sleep(2000);

    const startGame = await page.waitForSelector(
      'button[data-cy="start-solo-game"]',
      { timeout: 15000 }
    );
    await startGame?.click();

    const totalQuestions = await page.waitForSelector(
      'span[data-cy="total-question-number"]'
    );
    const totalNumberQuestions = await totalQuestions?.evaluate(
      (el) => el.innerText
    );

    console.log(
      boxen(
        chalk.bold.blue(
          `NÚMERO DE QUESTÕES ENCONTRADAS: ${totalNumberQuestions}`
        ),
        {
          padding: 0,
          margin: 0,
          borderStyle: "round",
          borderColor: "blue",
          width: 40,
        }
      )
    );

    for (let i = 0; i < Number(totalNumberQuestions); i++) {
      const questionContainer = await page.waitForSelector(
        'div[id="questionText"]',
        { timeout: 3000 }
      );
      const questionText = await questionContainer?.evaluate(
        (el) => el.textContent
      );

      console.log(
        boxen(
          chalk.bold.blue(
            `DESCRIÇÃO DA QUESTÃO\n\n- ${chalk.bold.yellow(questionText)}`
          ),
          {
            padding: 0,
            margin: 0,
            borderStyle: "round",
            borderColor: "blue",
            width: 40,
          }
        )
      );

      const options = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div"))
          .filter((div) => div.id.includes("option"))
          .map((div) => div.textContent);
      });

      allOptions.clear();
      options.forEach((opt, idx) => allOptions.set(idx, opt));

      if (allOptions.size > 0) {
        allOptions.forEach((v, i) => {
          console.log(
            boxen(chalk.greenBright(`${i} - ${v}`), {
              padding: 0,
              margin: 0,
              borderStyle: "round",
              borderColor: "green",
              width: 40,
            })
          );
        });
      }

      const answer = await getAnswer(questionText!, allOptions);

      console.log(
        boxen(
          chalk.bold.blue(
            `RESPOSTA IDENTIFICADA: ${chalk.greenBright(answer)}`
          ),
          {
            padding: 0,
            margin: 0,
            borderStyle: "round",
            borderColor: "green",
            width: 40,
          }
        )
      );

      await page.evaluate((answer) => {
        const correctOption = Array.from(document.querySelectorAll("div")).find(
          (div) =>
            div.innerText.trim().toLowerCase() === answer.trim().toLowerCase()
        );
        correctOption?.click();
      }, answer);

      await sleep(2000);

      ascii();
    }
  } catch (err) {
    console.error(
      boxen(chalk.bold.red(`[ERROR]\n${err}`), {
        padding: 0,
        margin: 0,
        borderStyle: "round",
        borderColor: "red",
      })
    );
  }
}
