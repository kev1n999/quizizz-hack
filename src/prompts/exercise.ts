import inquirer from "inquirer";

export async function exercicesUrl() {
  const { exerciceUrl } = await inquirer.prompt([
    {
      type: "input",
      name: "exerciceUrl",
      message: "Insira a URL do exercício que você deseja automatizar",
      validate: (url) =>
        true ? url.startsWith("https://wayground.com/join/") : "URL de exercício inválida!",
    },
  ]);

  return exerciceUrl;
}
