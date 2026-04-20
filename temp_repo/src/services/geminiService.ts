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
        ⚠️ ATENÇÃO: Esta oferta especial está disponível apenas por tempo limitado
        <span>Bônus exclusivos inclusos apenas neste lote — sem previsão de reposição</span>
      </div>

      <!-- HEADLINE ZONE -->
      <div class="headline-zone">
        <span class="pre-head">Revelação Exclusiva — Saúde Feminina 2025</span>
        <h1 class="main-head">
          ${userName}, seu hipotálamo está em <span class="red">"Modo de Sobrevivência"</span> — Mas você pode <span class="u">desligá-lo em 14 dias</span>
        </h1>
        <p class="sub-head">
          Com base nos seus sintomas de ${answers[0]}, identificamos um desequilíbrio na sua Via Adrenal. Veja como o Protocolo da Serenidade vai restaurar sua paz.
        </p>
      </div>

      <!-- SOCIAL PROOF BAR -->
      <div class="social-proof-bar">
        <span class="sp-item"><span class="ic">⭐</span> +3.700 mulheres já usaram</span>
        <span class="sp-item"><span class="ic">🛡️</span> Garantia de 7 dias</span>
        <span class="sp-item"><span class="ic">✅</span> 100% natural</span>
        <span class="sp-item"><span class="ic">⚡</span> Acesso imediato</span>
      </div>

      <!-- BODY SEC -->
      <div class="body-sec">
        <div class="wrap">
          <div class="lede-box">
            "O que você está sentindo não é 'apenas a idade'. É o seu termostato interno travado. O Protocolo da Serenidade é a chave para destravar sua vitalidade."
          </div>

          <h2 class="mini-head">Sua Situação Atual</h2>
          <p>Ao analisar suas respostas, percebemos que a sua <strong class="bold">Via Adrenal</strong> está sobrecarregada. Isso explica por que métodos comuns não funcionaram até agora.</p>

          <ul class="id-list">
            <li><span class="ic">😶‍🌫️</span><span>Sua névoa mental é um sinal de inflamação no hipotálamo.</span></li>
            <li><span class="ic">🔥</span><span>Seus calorões são alarmes falsos do seu termostato desregulado.</span></li>
            <li><span class="ic">🌙</span><span>Sua insônia é causada pelo pico de cortisol na hora errada.</span></li>
          </ul>

          <hr class="divider">

          <h2 class="mini-head">A descoberta que muda tudo: o "Termostato Travado"</h2>
          <p>Durante anos, a medicina convencional tratou a menopausa como um simples problema de deficiência hormonal. A lógica era direta: estrogênio caiu, então vamos repor.</p>
          <p>O problema é que essa lógica está errada — ou pelo menos, incompleta.</p>
          <p>Quando estudamos as mulheres de Bama, encontramos algo que contradiz tudo o que aprendemos na faculdade: essas mulheres também têm queda de estrogênio na menopausa. A biologia delas é idêntica à sua. Mas os sintomas simplesmente não aparecem com a mesma intensidade.</p>
          <p>A diferença não está no estrogênio. Está em um mecanismo que a medicina ocidental quase nunca menciona:</p>
          <p>O hipotálamo — o "termostato" do seu cérebro — quando exposto ao estresse crônico moderno, trava em um estado que chamamos de "Modo de Sobrevivência". Nesse estado, ele dispara falsos alarmes de temperatura, compromete o córtex pré-frontal (seu centro de foco e memória) e mantém o cortisol elevado à noite. O resultado? Calorões. Névoa mental. Irritabilidade. Sono fragmentado. Tudo saindo da mesma fonte: um interruptor que não foi desligado.</p>
          <p>As mulheres de Bama ativam — através da alimentação, da respiração e de práticas diárias simples — o que minha equipe batizou de "Via Adrenal de Equilíbrio": um conjunto de sinais que ensinam o hipotálamo a voltar ao modo de paz.</p>
          <p>Não é magia. É fisiologia. E é exatamente o que o Protocolo da Serenidade reproduz, passo a passo, de forma prática.</p>

          <h3 class="mini-head" style="font-size: 22px;">Por que os tratamentos que você tentou não funcionaram de vez?</h3>
          <p>Não foi culpa sua. E não foi falta de esforço. O problema foi a abordagem.</p>

          <ul class="id-list">
            <li><span class="ic">❌</span><span><strong class="bold">Chás e fitoterápicos isolados:</strong> aliviam sintomas pontualmente, mas não enviam o sinal correto ao hipotálamo. O alarme continua ligado.</span></li>
            <li><span class="ic">❌</span><span><strong class="bold">Terapia hormonal sintética:</strong> substitui o estrogênio de fora, mas não recalibra o termostato interno. O corpo não aprende a se autorregular.</span></li>
            <li><span class="ic">❌</span><span><strong class="bold">Dietas restritivas:</strong> sem a combinação certa de fitoestrógenos na sequência correta, os receptores hormonais não recebem o sinal de equilíbrio.</span></li>
            <li><span class="ic">❌</span><span><strong class="bold">Suplementos genéricos:</strong> não ativam a Via Adrenal. São ingredientes corretos sem o contexto de aplicação.</span></li>
            <li><span class="ic">❌</span><span><strong class="bold">Técnicas de relaxamento comuns:</strong> não estimulam o nervo vago da forma específica necessária para recalibrar o hipotálamo em Modo de Sobrevivência.</span></li>
          </ul>

          <p>O Protocolo da Serenidade é diferente porque age nos dois pontos simultaneamente: o sistema nervoso e a bioquímica hormonal. Quando ambos recebem o sinal certo, o hipotálamo entende que o estado de emergência acabou.</p>

          <hr class="divider">

          <h2 class="mini-head red">A Solução: O Mecanismo de Reset Térmico™</h2>
          <p>O Protocolo da Serenidade age na raiz do problema, recalibrando seu corpo em duas fases:</p>

          <div class="mec-list">
            <div class="mec-item">
              <div class="mec-num">1</div>
              <div>
                <h4>Fase 1 — O Reset Térmico (Dias 1 a 7)</h4>
                <p>Ritual de 12 minutos para sinalizar "Paz" ao seu cérebro e baixar o cortisol.</p>
              </div>
            </div>
            <div class="mec-item">
              <div class="mec-num">2</div>
              <div>
                <h4>Fase 2 — A Blindagem de Bama (Dias 8 a 14)</h4>
                <p>Cardápio estratégico para nutrir sua Via Adrenal e estabilizar os hormônios.</p>
              </div>
            </div>
          </div>

          <h2 class="mini-head">O Que Outras Mulheres Dizem</h2>
          <div class="depos">
            <div class="depo">
              <div class="depo-stars">★★★★★</div>
              <p class="depo-text">"Em 10 dias voltei a pensar com clareza. A névoa que eu achava que era 'da idade' sumiu completamente. Minha filha notou a mudança antes de mim — disse que eu estava 'de volta'. Nunca imaginei que 12 minutos por dia pudessem fazer isso."</p>
              <p class="depo-who">Cláudia M., 54 anos — São Paulo, SP</p>
              <div class="result-badge">✓ Névoa mental eliminada em 10 dias</div>
            </div>

            <div class="depo">
              <div class="depo-stars">★★★★★</div>
              <p class="depo-text">"Passei 2 anos com terapia hormonal. O alívio era parcial e os efeitos colaterais eram piores que os sintomas. Em 7 dias com o Reset Térmico, dormi a noite inteira pela primeira vez em meses. Na segunda semana, meu marido perguntou o que eu tinha feito diferente."</p>
              <p class="depo-who">Patrícia R., 49 anos — Belo Horizonte, MG</p>
              <div class="result-badge">✓ Sono restaurado na 1ª semana</div>
            </div>

            <div class="depo">
              <div class="depo-stars">★★★★★</div>
              <p class="depo-text">"Estava muito desconfiada — já tinha visto tanta promessa nessa área. Mas o protocolo é tão concreto e os passos tão claros que me senti no controle desde o dia 1. Em 14 dias me tornei eu mesma de novo. Dois meses depois ainda sou eu."</p>
              <p class="depo-who">Sandra V., 57 anos — Curitiba, PR</p>
              <div class="result-badge">✓ Clareza sustentada após 2 meses</div>
            </div>
          </div>

          <hr class="divider-thick">

          <!-- GARANTIA -->
          <div class="garantia">
            <h3>🛡️ Garantia de 7 Dias</h3>
            <p>Você tem 7 dias para testar o protocolo. Se não sentir a diferença, devolvemos seu dinheiro. Risco zero.</p>
          </div>

          <!-- FINAL PS -->
          <div class="callout callout-gray">
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
