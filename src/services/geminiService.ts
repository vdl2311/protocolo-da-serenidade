import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDiagnosis(userName: string, answers: string[]) {
  const prompt = `
    Você é um especialista em saúde integrativa e longevidade, focado no "Padrão Bama".
    Sua tarefa é escrever um DIAGNÓSTICO PERSONALIZADO extremamente breve para ${userName}.
    
    Respostas do Quiz:
    - Problema principal: ${answers[0]}
    - Acorda entre 2h e 4h: ${answers[2]}
    
    ESTRUTURA OBRIGATÓRIA (Siga exatamente este modelo):
    1. Comece com: "✅ PERFIL ANALISADO COM SUCESSO"
    2. Frase 1: ${userName}, seu "Interruptor Térmico" está travado no Modo de Sobrevivência.
    3. Frase 2: Relacione o sintoma (${answers[0]}) e o fato de acordar de madrugada (${answers[2]}) ao Hipotálamo em sinal de pânico (parando de queimar energia para estocar gordura).
    4. Frase 3: O Protocolo da Serenidade é a única chave para destravar sua Via Adrenal e resetar seu metabolismo em 14 dias.

    REGRAS CRÍTICAS:
    - Máximo de 3 frases curtas após o cabeçalho de sucesso.
    - Tom autoritário e direto.
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
