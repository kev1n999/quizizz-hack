import inquirer from "inquirer";

export async function confirmLogin(): Promise<boolean> {
  const { confirmedLogin } = await inquirer.prompt([
    {
      type: "input",
      name: "confirmedLogin",
      message: "Confirme o login e digite y para prosseguir:",
    },
  ]);

  return confirmedLogin.toLowerCase() === "y";
}
