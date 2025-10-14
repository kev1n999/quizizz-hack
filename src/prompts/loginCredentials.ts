import inquirer from "inquirer";

export async function loginCredentials() {
  const { email } = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Insira o seu endereço de e-mail(@escola)",
      validate: (email) =>
        true
          ? email.includes("@")
          : "Ocorreu um erro: Endereço de e-mail inválido!",
    },
  ]);

  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      message: "Insira a sua senha",
    },
  ]);

  return { email, password };
}
