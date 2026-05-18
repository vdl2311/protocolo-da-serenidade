import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ChevronDown, Lock, Zap, Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const checkoutLink = "https://pay.hotmart.com/Y98549636E?checkoutMode=10";

export default function App() {
  const [showFloatCta, setShowFloatCta] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatCta(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-dark">
      {/* TOPBAR */}
      <div className="bg-dark text-white py-2.5 px-5 text-center text-xs md:text-sm tracking-wide z-50">
        Acesso imediato · <span className="text-gold font-medium">Garantia de 7 dias sem perguntas</span> · Pagamento 100% seguro
      </div>

      {/* HERO */}
      <section className="bg-warm-white pt-20 pb-0 px-5 text-center relative overflow-hidden">
        {/* Background Gradient Circle */}
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(200,133,106,0.12)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container relative z-10">
          <p className="text-rose text-xs font-medium tracking-[0.18em] uppercase mb-6 animate-fade-in [animation-delay:0.1s]">
            Equilíbrio e bem-estar feminino natural
          </p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-[clamp(42px,7vw,76px)] leading-[1.08] text-dark max-w-[780px] mx-auto mb-7"
          >
            O Protocolo que ajuda seu corpo a encontrar<br />
            <span className="italic text-rose">serenidade e equilíbrio</span><br />
            na menopausa
          </motion.h1>
          <p className="text-mid text-lg font-light leading-[1.7] max-w-[560px] mx-auto mb-12 animate-fade-in [animation-delay:0.4s]">
            Estratégias naturais simples — alimentação, respiração e rituais noturnos — para apoiar seu bem-estar de dentro para fora nessa fase de transformação.
          </p>
          
          <div className="animate-fade-in [animation-delay:0.5s] mb-12">
            <a href={checkoutLink} className="btn-primary inline-block w-auto py-[18px] px-12 text-base">
              Quero meu acesso agora · R$ 37,90
            </a>
          </div>

        </div>
      </section>

      {/* PROOF BAR */}
      <div className="bg-dark py-5 px-5 flex justify-center gap-12 md:gap-24 flex-wrap">
        {[
          { label: "+2.800", sub: "mulheres impactadas" },
          { label: "5★", sub: "avaliação média" },
          { label: "7 dias", sub: "garantia total" },
          { label: "100%", sub: "acesso imediato" }
        ].map((item, i) => (
          <div key={i} className="text-center">
            <strong className="block font-serif text-3xl text-gold font-medium leading-none">{item.label}</strong>
            <span className="text-[12px] text-white/60 tracking-wider font-light">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* PAIN SECTION (DOR) */}
      <section className="py-20 md:py-32 bg-warm-white">
        <div className="container">
          <span className="section-label">Sua jornada começa aqui</span>
          <h2 className="section-title">Muitas mulheres buscam mais equilíbrio nessa fase da vida</h2>
          <p className="section-sub">
            A mudança hormonal é natural — e existem hábitos simples que ajudam o corpo a se adaptar com mais leveza e bem-estar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              { emoji: "😴", title: "Melhor qualidade de sono", desc: "Despertar mais revigorada e descansada. Dormir profundamente e acordar com energia renovada." },
              { emoji: "⚡", title: "Energia e vitalidade", desc: "Manter-se ativa e disposta ao longo do dia. Sentir leveza e disposição para as atividades que importam." },
              { emoji: "😊", title: "Equilíbrio emocional", desc: "Lidar com mais calma e clareza. Manter estabilidade emocional mesmo em momentos desafiadores." },
              { emoji: "🌿", title: "Bem-estar natural", desc: "Apoiar o corpo de forma holística. Sentir-se plena e em harmonia com as mudanças naturais da vida." }
            ].map((card, i) => (
              <div key={i} className="bg-cream border border-rose-mid rounded-2xl p-8 transition-all hover:bg-white">
                <div className="text-[28px] mb-3">{card.emoji}</div>
                <h3 className="font-serif text-xl font-medium text-dark mb-2">{card.title}</h3>
                <p className="text-sm text-mid leading-[1.65]">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-rose-light border-l-[3px] border-rose rounded-r-xl p-8 font-serif text-[22px] italic text-dark leading-[1.7]">
            "E se pequenas mudanças no dia a dia pudessem trazer muito mais leveza, energia e equilíbrio?"
          </div>
        </div>
      </section>

      {/* BAMA SECTION */}
      <section className="bg-dark text-white py-24 md:py-40">
        <div className="container">
          <span className="section-label !text-gold">A descoberta</span>
          <h2 className="section-title !text-white">Em Bama, na China, mulheres de 70, 80 e 90 anos vivem com vitalidade e energia</h2>
          <p className="section-sub !text-white/65">O segredo não está em remédios. Está nos hábitos diários.</p>
          
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-6">
              <p className="text-white/80 leading-[1.8] text-base font-light">
                Toda manhã, mulheres de 70, 80 e até 90 anos em Bama acordam com disposição, preparam seus alimentos com as próprias mãos e começam o dia com vitalidade. Dormir bem. Manter a energia. Lidar com leveza os desafios do corpo. Simplesmente… vivas e plenas.
              </p>
              <p className="text-white/80 leading-[1.8] text-base font-light">
                Pesquisadores do mundo todo foram até lá descobrir o segredo. O que encontraram surpreendeu: <strong className="text-gold font-medium">o segredo está nos hábitos diários, na alimentação e no estilo de vida.</strong> Comem alimentos ricos em fitoestrógenos naturais, movem o corpo com leveza todos os dias e dormem com rituais simples — geração após geração.
              </p>
              <p className="text-white/80 leading-[1.8] text-base font-light">
                O Protocolo da Serenidade foi inspirado nessa sabedoria milenar — traduzida em hábitos práticos que qualquer mulher brasileira pode adotar a partir de hoje.
              </p>
              
              <div className="space-y-5 pt-4">
                {[
                  { num: "43", text: "centenários por 100 mil habitantes em Bama — muito acima do padrão mundial de 7,5 (dados ONU / NIH)" },
                  { num: "5×", text: "maior proporção de pessoas com mais de 100 anos em relação à média da China" }
                ].map((stat, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-xl items-center">
                    <span className="font-serif text-[42px] text-gold font-medium leading-none shrink-0">{stat.num}</span>
                    <p className="text-[14px] text-white/70 leading-[1.6]">{stat.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden group">
              <img 
                src="/bbama.png" 
                alt="Mulheres centenárias de Bama" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-dark/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-medium mb-1">Sabedoria Ancestral</span>
                <p className="text-white/80 text-sm italic">"Rituais que atravessam gerações"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="py-20 md:py-32">
        <div className="container">
          <span className="section-label">O que você recebe</span>
          <h2 className="section-title">Protocolo da Serenidade</h2>
          <p className="section-sub">Um guia completo e prático dividido em capítulos que você pode aplicar no seu próprio ritmo.</p>
          
          <div className="flex justify-center mb-16 px-4">
            <div className="ebook-card">
              <span className="text-[11px] tracking-widest uppercase text-mid">Guia Natural</span>
              <div className="w-10 h-[1px] bg-rose" />
              <div className="font-serif text-[22px] font-semibold text-dark leading-tight">Protocolo<br/>da<br/>Serenidade</div>
              <div className="w-10 h-[1px] bg-rose" />
              <span className="text-[10px] tracking-widest uppercase text-mid">Equilíbrio · Bem-estar · Vitalidade</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "01", title: "O Paradoxo do Estrogênio", desc: "Como apoiar o equilíbrio natural do seu corpo através de hábitos e alimentação." },
              { id: "02", title: "Método R.E.S.E.T. Hormonal", desc: "5 minutos por dia para apoiar o equilíbrio natural do sistema nervoso." },
              { id: "03", title: "Técnica do Interruptor Térmico", desc: "Técnica de respiração e pressão para trazer mais conforto térmico." },
              { id: "04", title: "Os 7 Gatilhos Ocultos", desc: "Hábitos diários que podem estar limitando seu bem-estar — e como otimizá-los." },
              { id: "05", title: "Ritual Noturno de 12 Minutos", desc: "Uma sequência simples para restaurar o sono profundo e acordar com energia." },
              { id: "06", title: "Plano Alimentar da Serenidade", desc: "Cardápio completo de 14 dias com alimentos que apoiam o equilíbrio hormonal natural." }
            ].map((module, i) => (
              <div key={i} className="bg-warm-white border border-rose/20 rounded-2xl p-6 flex gap-5 items-start">
                <span className="font-serif text-[32px] text-rose-mid leading-none shrink-0">{module.id}</span>
                <div className="space-y-1.5">
                  <h4 className="text-[14px] font-medium text-dark leading-tight">{module.title}</h4>
                  <p className="text-[13px] text-light leading-[1.6]">{module.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUS SECTION */}
      <section className="bg-dark text-white py-20 px-5 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(201,169,110,0.07)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container relative z-10">
          <span className="section-label !text-gold">Surpresa especial</span>
          <h2 className="section-title !text-white !mb-4">
            Você recebe o Protocolo<br />
            <span className="text-gold italic font-serif"> + 3 bônus exclusivos</span>
          </h2>
          <p className="section-sub !text-white/55">Materiais completos que aceleram seus resultados e tornam a jornada muito mais prática.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* BONUS 1 */}
            <div className="bonus-card">
              <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase mb-6">Bônus 01</span>
              <span className="text-4xl mb-4 block leading-none">📅</span>
              <h3 className="font-serif text-[26px] text-white font-medium leading-tight mb-3">Plano de 14 Dias para Equilíbrio Hormonal</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">Um roteiro dia a dia baseado nos 3 pilares do Protocolo — Nutrição, Bem-Estar e Suplementação. Tudo organizado para você começar com confiança e sem dúvidas.</p>
              
              <div className="bonus-mockup">
                <span className="text-[11px] text-gold uppercase tracking-widest mb-3 block">O que está incluído</span>
                <div className="space-y-1">
                  {["Ações práticas para cada um dos 14 dias", "Checklist diário para marcar seus hábitos", "Dicas de ajuste por sintoma (calor, humor, fadiga)", "Revisão semanal para acompanhar a evolução", "Guia de suplementação natural por fase"].map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[13px] text-white/70 py-1.5 border-b border-white/5 last:border-0 border-solid">
                       <Check size={14} className="text-gold shrink-0 mt-0.5" />
                       <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Dias 1–3: Fundamentos", "Dias 4–7: Consistência", "Dias 8–10: Intensificação", "Dias 11–14: Celebração"].map((phase, idx) => (
                  <span key={idx} className="bg-gold/10 border border-gold/20 text-gold text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap">{phase}</span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/30 text-sm line-through">R$ 47,00</span>
                <span className="text-gold text-[15px] font-medium tracking-wide">✦ GRÁTIS</span>
              </div>
            </div>

            {/* BONUS 2 */}
            <div className="bonus-card">
              <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase mb-6">Bônus 02</span>
              <span className="text-4xl mb-4 block leading-none">🍽️</span>
              <h3 className="font-serif text-[26px] text-white font-medium leading-tight mb-3">Receitas Hormonais</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">Mais de 14 receitas nutritivas — do café ao jantar — com benefícios comprovados para você.</p>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Overnight de Linhaça", "Salmão Assado", "Bowl de Quinoa", "+ 7 receitas"].map((t, idx) => (
                  <div key={idx} className="bg-white/7 rounded-lg p-2 flex items-center gap-2 text-[12px] text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span className="truncate">{t}</span>
                  </div>
                ))}
              </div>

              <div className="bonus-mockup">
                <span className="text-[11px] text-gold uppercase tracking-widest mb-3 block">Cada receita inclui</span>
                <div className="space-y-2 text-[13px] text-white/70">
                  <div className="flex gap-2.5">✓ Benefício hormonal explicado</div>
                  <div className="flex gap-2.5">✓ Ingredientes fáceis de encontrar no Brasil</div>
                  <div className="flex gap-2.5">✓ Dicas de preparo rápido e variações veganas</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/30 text-sm line-through">R$ 37,00</span>
                <span className="text-gold text-[15px] font-medium tracking-wide">✦ GRÁTIS</span>
              </div>
            </div>

            {/* BONUS 3 */}
            <div className="bonus-card">
              <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase mb-6">Bônus 03</span>
              <span className="text-4xl mb-4 block leading-none">📓</span>
              <h3 className="font-serif text-[26px] text-white font-medium leading-tight mb-3">Diário da Menopausa</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">Uma planilha interativa para registrar sintomas, humor, energia e sono dia a dia — e visualizar sua evolução de forma clara ao longo do tempo.</p>
              
              <div className="bg-white/5 rounded-xl p-3.5 mb-6 border border-white/5">
                <span className="text-[11px] text-white/50 uppercase tracking-widest mb-2.5 block">Preview da planilha</span>
                <div className="space-y-3">
                  {[
                    { l: "Ondas de calor", c: "rose", dots: 5, active: 1 },
                    { l: "Qualidade do sono", c: "sage", dots: 5, active: 3 },
                    { l: "Nível de energia", c: "gold", dots: 5, active: 2 },
                    { l: "Humor", c: "sage", dots: 5, active: 4 }
                  ].map((row, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[12px] border-b border-white/5 last:border-0 pb-1.5 last:pb-0">
                      <span className="text-white/50">{row.l}</span>
                      <div className="flex gap-1">
                        {[...Array(row.dots)].map((_, di) => (
                          <div 
                            key={di} 
                            className={`w-3.5 h-3.5 rounded-[3px]`} 
                            style={{ 
                              backgroundColor: row.c === 'rose' ? '#C8856A' : row.c === 'sage' ? '#7A9E8E' : '#C9A96E',
                              opacity: di < row.active ? 1 : 0.2
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-8">
                {["Visão semanal e comparativa da evolução", "Espaço para notas de alimentação e hábitos", "Funciona no celular, tablet ou computador"].map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[13px] text-white/60">
                    <Check size={14} className="text-gold shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/30 text-sm line-through">R$ 27,00</span>
                <span className="text-gold text-[15px] font-medium tracking-wide">✦ GRÁTIS</span>
              </div>
            </div>

          </div>

          {/* BONUS RESUMO */}
          <div className="bg-linear-to-br from-[rgba(201,169,110,0.1)] to-[rgba(200,133,106,0.07)] border border-gold/25 rounded-[20px] p-9 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="space-y-2.5">
              <h3 className="font-serif text-3xl text-white font-medium leading-tight">Tudo isso por apenas R$ 37,90</h3>
              <p className="text-[15px] text-white/55 leading-relaxed">Você leva o Kit completo (Protocolo + 3 Bônus) em um único acesso imediato — com garantia total de 7 dias sem burocracia.</p>
            </div>
            <div className="md:text-right shrink-0">
               <div className="text-white/40 text-[11px] uppercase tracking-widest mb-1.5">Valor total</div>
               <div className="font-serif text-[28px] text-white/25 line-through leading-none mb-1">R$ 208,00</div>
               <div className="font-serif text-[52px] text-gold font-medium leading-none">R$ 37,90</div>
               <div className="text-[12px] text-white/35 mt-1">você economiza R$ 170,10</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-32 bg-warm-white">
        <div className="container">
          <span className="section-label">O que dizem as leitoras</span>
          <h2 className="section-title">Resultados reais, histórias reais</h2>
          <p className="section-sub">Mulheres que aplicaram o Protocolo da Serenidade no dia a dia.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { char: "M", text: "Comecei com a linhaça e o ritual de respiração. Em duas semanas eu já estava dormindo melhor. Não acreditei até acontecer comigo.", name: "Marta S.", loc: "São Paulo, SP · 52 anos" },
              { char: "C", text: "O capítulo dos gatilhos ocultos me abriu os olhos. Nunca imaginei que o café da tarde estava contribuindo tanto. Reduzi e a diferença foi imediata.", name: "Claudia R.", loc: "Belo Horizonte, MG · 49 anos" },
              { char: "A", text: "O plano alimentar de 14 dias é maravilhoso. Simples, sem restrições absurdas e minha energia voltou. Me sinto outra pessoa.", name: "Ana Paula T.", loc: "Curitiba, PR · 55 anos" }
            ].map((test, i) => (
              <div key={i} className="bg-cream border border-rose/15 rounded-2xl p-7 flex flex-col items-start">
                <span className="font-serif text-[64px] text-rose-mid leading-[0.8] mb-3">"</span>
                <p className="font-serif text-[18px] italic text-mid leading-relaxed mb-6"> {test.text} </p>
                <div className="mt-auto flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-rose to-sage flex items-center justify-center font-serif text-[18px] font-medium text-white shadow-sm shrink-0">{test.char}</div>
                  <div>
                    <div className="text-gold text-[14px] leading-none mb-1">★★★★★</div>
                    <div className="text-[13px] font-medium text-dark leading-none pb-0.5">{test.name}</div>
                    <div className="text-[12px] text-light leading-none">{test.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="comprar" className="py-20 px-5 bg-warm-white">
        <div className="max-w-[620px] mx-auto bg-dark rounded-[28px] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-[radial-gradient(circle,rgba(200,133,106,0.2)_0%,transparent_70%)] pointer-events-none" />
          
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-gold mb-4 block">Acesso imediato</span>
          <h2 className="font-serif text-[42px] font-medium text-white leading-[1.15] mb-3">Comece hoje mesmo</h2>
          <p className="text-[15px] text-white/60 leading-[1.7] mb-9">Um guia completo + 3 bônus exclusivos por um valor que cabe em qualquer orçamento. Sem mensalidades.</p>
          
          <div className="mb-10 px-4">
            <img 
              src="/mockup serenidade.png" 
              alt="Mockup Protocolo da Serenidade" 
              className="w-full max-w-[400px] mx-auto h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          
          <div className="space-y-1 mb-7">
            <div className="text-[16px] text-white/35 line-through">De R$ 208,00</div>
            <div className="font-serif text-[64px] font-medium text-white leading-none">
              <span className="text-[28px] align-top mt-2 inline-block">R$</span> 37,90
            </div>
            <div className="text-[13px] text-white/45">pagamento único · acesso permanente</div>
          </div>

          <a href={checkoutLink} className="btn-primary !w-full mb-4">
            Quero o Protocolo da Serenidade agora →
          </a>

          <div className="text-[13px] text-white/45 flex items-center justify-center gap-1.5 opacity-80">
            <div className="w-[18px] h-[18px] rounded-full bg-white/15 flex items-center justify-center text-[10px]"><Check size={10} /></div>
            Garantia de 7 dias — reembolso total sem perguntas
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="bg-sage-light py-16 md:py-24">
        <div className="container">
          <div className="max-w-[680px] mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="w-[120px] h-[120px] rounded-full bg-sage flex flex-col items-center justify-center text-white shrink-0 shadow-lg">
              <strong className="font-serif text-4xl md:text-5xl font-medium leading-none">7</strong>
              <span className="text-[10px] tracking-widest opacity-85 uppercase font-bold mt-1">Dias</span>
              <span className="text-[8px] opacity-70 uppercase tracking-tighter">Garantia</span>
            </div>
            <div className="text-center md:text-left space-y-3">
              <h3 className="font-serif text-3xl text-dark font-medium leading-tight">Risco zero para você</h3>
              <p className="text-[15px] text-mid leading-[1.75] font-light">Se por qualquer motivo você não ficar satisfeita com o Protocolo da Serenidade nos primeiros 7 dias após a compra, basta nos enviar um e-mail e devolvemos 100% do seu dinheiro — sem perguntas, sem burocracia. Você não tem nada a perder.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="container">
          <span className="section-label">Dúvidas frequentes</span>
          <h2 className="section-title">Perguntas e respostas</h2>
          
          <div className="max-w-[680px] mx-auto space-y-1">
            {[
              { q: "Como recebo o material após a compra?", a: "Imediatamente após a confirmação do pagamento, você recebe um e-mail com o link de acesso ao ebook e a todos os bônus. O acesso é 100% digital e permanente." },
              { q: "Os bônus já estão incluídos no valor de R$ 37,90?", a: "Sim! O Plano de 14 Dias, o Livro de Receitas Hormonais e o Diário da Menopausa são entregues gratuitamente junto com o Protocolo da Serenidade. Nenhum custo adicional." },
              { q: "Funciona para qualquer fase da menopausa?", a: "Sim. As estratégias do Protocolo da Serenidade são adaptáveis a diferentes fases da vida e podem ser customizadas de acordo com suas necessidades pessoais." },
              { q: "Precisa parar de tomar medicamentos?", a: "Não. O Protocolo da Serenidade é um guia de bem-estar e hábitos naturais — um complemento, não um substituto. Sempre siga as orientações do seu médico." },
              { q: "O pagamento é seguro?", a: "Sim. Usamos plataformas com criptografia SSL e seus dados estão totalmente protegidos." },
              { q: "E se eu não gostar?", a: "Você tem 7 dias de garantia total. Se não ficar satisfeita por qualquer razão, devolvemos 100% do valor pago sem questionamentos." },
              { q: "Quanto tempo preciso por dia para aplicar o protocolo?", a: "As técnicas principais levam de 5 a 12 minutos. O plano alimentar usa alimentos do cotidiano e não exige preparo elaborado. Cabe na rotina de qualquer mulher." }
            ].map((item, i) => (
              <div key={i} className={`border-b border-rose/20 transition-all ${openFaq === i ? 'faq-item-open' : ''}`}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left py-6 gap-4 text-dark font-medium text-[16px] faq-q"
                >
                  {item.q}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[15px] text-mid leading-[1.75] pb-6">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="bg-rose-light/50 py-16 md:py-20 text-center">
        <div className="container">
          <span className="section-label">Última chamada</span>
          <h2 className="section-title !mb-4">Você merece se sentir bem</h2>
          <p className="section-sub !mb-10 !max-w-[100%]">Pequenas mudanças diárias fazem grandes diferenças. <br className="hidden md:block" /> O primeiro passo é o mais importante.</p>
          <a href={checkoutLink} className="btn-primary !bg-dark inline-block w-auto !py-[20px] !px-12 !text-[17px]">
            Quero começar agora · R$ 37,90 →
          </a>
          <p className="text-[13px] text-mid mt-5">Garantia de 7 dias · Acesso imediato · + 3 bônus exclusivos</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white/35 py-12 px-5 text-center">
        <div className="flex justify-center gap-6 mb-8 uppercase tracking-widest font-medium">
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos</a>
          <a href="#" className="hover:text-white transition-colors">Contato</a>
        </div>
        <p className="max-w-2xl mx-auto leading-relaxed italic mb-8">
          <strong className="text-white/60 not-italic">⚠️ Aviso importante:</strong> Este conteúdo é estritamente informativo e educativo. Não substitui, diagnostica nem trata condições médicas. Não substitui orientação médica profissional. Consulte sempre um médico ou profissional de saúde antes de realizar mudanças em seu estilo de vida. Os resultados individuais podem variar.
        </p>
        <p className="uppercase tracking-[0.3em] mb-4">© 2026 Protocolo da Serenidade · Todos os direitos reservados</p>
        <a href="mailto:contato@seudominio.com.br" className="text-white/60 hover:text-gold transition-colors">contato@seudominio.com.br</a>
      </footer>

      {/* FLOATING CTA */}
      <AnimatePresence>
        {showFloatCta && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-dark text-white rounded-full py-3.5 px-8 flex items-center gap-5 md:gap-7 shadow-2xl border border-white/5 whitespace-nowrap overflow-hidden"
          >
            <span className="hidden sm:inline text-white/60 text-xs font-medium uppercase tracking-widest">Protocolo + 3 bônus</span>
            <span className="font-serif text-[22px] font-medium">R$ 37,90</span>
            <a href={checkoutLink} className="bg-rose text-white text-[14px] font-bold py-2.5 px-6 rounded-full hover:bg-[#B87560] transition-colors leading-none active:scale-95">Comprar agora</a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
