import { GoogleGenerativeAI } from "@google/generative-ai";
import { constants } from "config";

const ai = new GoogleGenerativeAI(constants.api_key);

export async function getAnswer(
  question: string,
  options: Map<number, string>
): Promise<string> {
  try {
    const geminiModel = ai.getGenerativeModel({
      model: "gemini-2.5-flash"
    });
    const result = await geminiModel.generateContent(
      `Questão de Quizziz:\n\n${question}\n\nAlternativas disponíveis:\n${Array.from(
        options.values()
      ).join(
        "\n"
      )}\n\nEnvie-me apenas a RESPOSTA (não envie nada além da alternativa correta, exatamente como ela aparece).`
    );

    const response = result.response;
    return response.text();
  } catch (err) {
    console.error(err);
  }

  return "";
}
