import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDiagnosis(userName: string, answers: string[]) {
  const prompt = `
    Você é um especialista em saúde integrativa e longevidade, focado no "Padrão Bama".
    Sua tarefa é escrever um DIAGNÓSTICO PERSONALIZADO para ${userName} com base nas respostas dela.
    
    Respostas do Quiz:
    - Problema principal: ${answers[0]}
    - Acorda entre 2h e 4h: ${answers[2]}
    - Motivo do insucesso anterior: ${answers[4]}
    
    ESTRUTURA OBRIGATÓRIA (Siga exatamente este modelo):
    1. Primeira linha: PERFIL ANALISADO COM SUCESSO
    2. Segunda linha: ${userName}, seu "Interruptor Térmico" está travado no Modo de Sobrevivência.
    3. Terceira linha: Comece com ⚠️. Relacione o sintoma específico dela (${answers[0]}) e o fato de acordar de madrugada (${answers[2]}) ao Hipotálamo em sinal de pânico, parando de queimar energia para estocar gordura.
    
    REGRAS CRÍTICAS:
    - Mantenha a mesma quantidade de palavras do exemplo: "⚠️ Suas ondas de calor sufocantes e o fato de acordar exausta de madrugada mostram seu Hipotálamo em sinal de pânico, parando de queimar energia para estocar gordura." (Aprox. 30-35 palavras na terceira linha).
    - **Use negrito** em termos chave como "Hipotálamo", "Modo de Sobrevivência", "Interruptor Térmico".
    - Tom autoritário, direto e empático.
    - Retorne APENAS o texto do diagnóstico (3 linhas).
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
