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
    2. Segunda linha: Escreva uma frase de impacto para ${userName} afirmando que o sistema hormonal dela precisa "ENDIREITAR" porque o "Interruptor Térmico" travou no "Modo de Sobrevivência" devido ao impacto de ${answers[0]}.
    3. Terceira linha: Comece com ⚠️. Relacione o sintoma dela (${answers[0]}), o padrão de sono (${answers[2]}) e a frustração de ${answers[4]} à "RAIZ" do problema: o Hipotálamo em sinal de pânico, que parou de queimar energia para estocar gordura como mecanismo de defesa.
    
    REGRAS CRÍTICAS:
    - Use termos como "Endireitar", "Raiz", "Modo de Sobrevivência", "Hipotálamo".
    - Mantenha a densidade de informação: a terceira linha deve ter aproximadamente 30-40 palavras.
    - **Use negrito** em termos chave.
    - Tom autoritário, direto e empático, com um toque de "revelação".
    - Retorne APENAS o texto do diagnóstico (3 linhas).
    - Use Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || "Não foi possível gerar seu diagnóstico no momento. Por favor, tente novamente.";
    return text.replace(/Análise Personalizada da IA:?\s*\n?/gi, "").trim();
  } catch (error) {
    console.error("Erro ao gerar diagnóstico:", error);
    return "Ocorreu um erro ao processar seu diagnóstico personalizado. Mas não se preocupe, o Protocolo da Serenidade foi desenhado exatamente para o seu perfil.";
  }
}
