import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDiagnosis(userName: string, answers: string[]) {
  const prompt = `
    Gere um diagnóstico personalizado em HTML para uma mulher na menopausa com base nestas respostas: ${JSON.stringify(answers)}.
    O nome dela é ${userName}.
    
    Use EXCLUSIVAMENTE a estrutura e as classes CSS abaixo (definidas no container .diagnosis-container):
       <div class="diagnosis-container">
      <!-- TOPBAR -->
      <div class="topbar">
        ⚠️ ATENÇÃO: Esta recomendação é exclusiva para ${userName}
        <span>Vaga garantida no lote atual do Protocolo da Serenidade</span>
      </div>

      <!-- HEADLINE ZONE -->
      <div class="headline-zone">
        <span class="pre-head">Relatório de Saúde Feminina — 2025</span>
        <h1 class="main-head">
          ${userName}, seu hipotálamo está em <span class="rose">"Modo de Sobrevivência"</span> — Mas você pode <span class="rose">desligá-lo em 14 dias</span>
        </h1>
        <p class="sub-head">
          Com base nos seus sintomas, identificamos um desequilíbrio na sua Via Adrenal. O Protocolo da Serenidade é a sua rota de volta ao equilíbrio.
        </p>
      </div>

      <!-- SOCIAL PROOF BAR -->
      <div class="social-proof-bar">
        <span class="sp-item">🛡️ Garantia de 7 dias</span>
        <span class="sp-item">✅ 100% natural</span>
        <span class="sp-item">⚡ Acesso imediato</span>
      </div>

      <!-- BODY SEC -->
      <div class="body-sec">
        <div class="wrap">
          <div class="lede-box">
            "Sua sensação de cansaço e os calorões não são 'natural da idade'. É o seu termostato interno travado. O Protocolo da Serenidade é a chave para restaurar sua vitalidade."
          </div>

          <h2 class="mini-head font-serif">Sua Análise Personalizada</h2>
          <p>Ao analisar suas respostas sobre <strong class="bold">${answers[0]}</strong>, percebemos que a sua <strong class="bold">Via Adrenal</strong> está emitindo sinais de alerta constantes para o seu cérebro.</p>
          
          <ul class="id-list">
            <li><span class="ic">✨</span><span><strong class="bold">Névoa Mental:</strong> Não é esquecimento, é excesso de sinalização de estresse no hipotálamo.</span></li>
            <li><span class="ic">🌿</span><span><strong class="bold">Desequilíbrio Térmico:</strong> Seu termostato interno precisa de um 'reset' bioquímico natural.</span></li>
            <li><span class="ic">🌙</span><span><strong class="bold">Sono Interrompido:</strong> Sua Via Adrenal está disparando cortisol em horários que deveria produzir melatonina.</span></li>
          </ul>

          <hr class="divider">

          <h2 class="mini-head">O Método de Reset de Bama</h2>
          <p>Enquanto a maioria dos métodos foca apenas na reposição, o Protocolo da Serenidade foca na <strong>recalibração</strong> do seu receptor hormonal natural.</p>

          <div class="mec-list">
            <div class="mec-item">
              <div class="mec-num">1</div>
              <div>
                <p class="bold" style="margin-bottom: 5px;">Acalmar o Sinal de Alerta</p>
                <p style="font-size: 15px;">Técnicas de 12 minutos que desativam o 'Modo de Sobrevivência' do cérebro.</p>
              </div>
            </div>
            <div class="mec-item">
              <div class="mec-num">2</div>
              <div>
                <p class="bold" style="margin-bottom: 5px;">Nutrição Adrenal</p>
                <p style="font-size: 15px;">A sequência exata de nutrientes para restaurar sua energia vital.</p>
              </div>
            </div>
          </div>

          <h2 class="mini-head">O que você receberá hoje</h2>
          <div class="depos">
            <div class="depo">
              <div class="depo-stars">★★★★★</div>
              <p class="depo-text">"Em 14 dias eu era outra pessoa. A clareza mental voltou e os calorões sumiram. Sinto que recuperei as rédeas da minha vida."</p>
              <p class="depo-who">Maria Luísa, 52 anos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="body-sec" style="padding-top: 0;">
      <div class="wrap">
        <div class="callout callout-gray" style="background: rgba(200,133,106,0.05); padding: 30px; border-radius: 16px; border: 1px solid var(--rose-mid); border-left: 5px solid var(--rose);">
          <p><strong>P.S.</strong> ${userName}, você está a um passo de recuperar sua serenidade. A decisão de hoje define como você se sentirá nos próximos 14 dias.</p>
        </div>
      </div>
    </div>
  </div>
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é um especialista em saúde integrativa. Responda APENAS com o HTML solicitado, sem markdown, sem explicações.",
      },
    });
    return response.text || "Ocorreu um erro ao gerar o diagnóstico.";
  } catch (error) {
    console.error("Erro ao gerar diagnóstico:", error);
    return "Ocorreu um erro ao processar seu diagnóstico personalizado.";
  }
}
