import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDiagnosis(userName: string, answers: string[]) {
  const prompt = `
    Você é um especialista em saúde integrativa e longevidade, focado no "Padrão Bama" (um método natural de equilíbrio hormonal inspirado em uma vila chinesa).
    
    Sua tarefa é escrever um DIAGNÓSTICO PERSONALIZADO para uma mulher chamada ${userName} que está passando pela menopausa/perimenopausa.
    
    Aqui estão as respostas dela ao nosso quiz:
    1. Problema mais urgente: ${answers[0]}
    2. Frequência de ondas de calor: ${answers[1]}
    3. Acorda entre 2h e 4h da manhã: ${answers[2]}
    4. Conhecimento sobre via adrenal: ${answers[3]}
    5. Por que não teve sucesso até agora: ${answers[4]}
    6. Disposição para o protocolo: ${answers[5]}
    
    DIRETRIZES PARA O TEXTO:
    - Use um tom empático, profissional e autoritário (mas acolhedor).
    - Seja extremamente CONCISO e DIRETO AO PONTO.
    - Use o nome dela (${userName}) pelo menos uma vez.
    - Explique brevemente por que o sintoma (${answers[0]}) está acontecendo (Via Adrenal/Hipotálamo).
    - Mencione o "Modo de Sobrevivência".
    - O texto deve ter no máximo 2 ou 3 parágrafos curtos.
    - Termine com uma frase curta de esperança.
    - Retorne APENAS o texto do diagnóstico.
    - Use Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Não foi possível gerar seu diagnóstico no momento. Por favor, tente novamente.";
  } catch (error) {
    console.error("Erro ao gerar diagnóstico:", error);
    return "Ocorreu um erro ao processar seu diagnóstico personalizado. Mas não se preocupe, o Protocolo da Serenidade foi desenhado exatamente para o seu perfil.";
  }
}
