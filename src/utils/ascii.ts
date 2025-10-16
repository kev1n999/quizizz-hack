import chalk from "chalk";
import figlet from "figlet";

export function ascii() {
  console.clear();
  const text = figlet.textSync("QUIZZIS HACK", { font: "Slant" });
  console.log(chalk.red(text));
  console.log(
    chalk.green(
      "Developed By Kevin - github.com/kev1n999\n-------------------------------------------------------------------\n"
    )
  );
}
