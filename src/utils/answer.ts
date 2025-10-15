export async function getAnswer(
  question: string,
  options: Map<number, string>
): Promise<string> {
  try {
    const request = await fetch(process.env.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Questão de Quizziz:\n\n${question}\n\nAlternativas disponíveis:\n${Array.from(
          options.values()
        ).join(
          "\n"
        )}\n\nEnvie-me apenas a RESPOSTA (não envie nada além da alternativa correta, exatamente como ela aparece).`,
      }),
    });

    if (request.ok) {
      const response = await request.json();
      return String(response?.response ?? "");
    } else {
      console.error("Ocorreu um erro na requisição:", request.status, request.statusText);
    }
  } catch (err) {
    console.error(err);
  }

  return "";
}
