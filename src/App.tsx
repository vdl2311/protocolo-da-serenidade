import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Moon, 
  Scale, 
  Brain, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  ShoppingBag,
  Zap,
  Heart,
  BookOpen,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { generateDiagnosis } from './services/geminiService';

// --- Types ---
type QuizStep = 'name' | 0 | 1 | 2 | 3 | 4 | 5 | 'analyzing' | 'diagnosis';

interface QuizState {
  step: QuizStep;
  answers: string[];
  userName: string;
}

const NotificationPopup = ({ show }: { show: boolean }) => {
  const notifications = [
    "🛒 Maria acabou de adquirir o Protocolo da Serenidade (Ribeirão Preto/SP)",
    "🛒 Tereza acaba de garantir o acesso com desconto (Juiz de Fora/MG)",
    "🔥 Mais de 1.247 mulheres já iniciaram o Reset de 14 dias este mês.",
    "📢 Apenas 4 vagas restantes com o valor promocional de R$ 47,90.",
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    const initialTimeout = setTimeout(() => {
      setVisible(true);
    }, 5000);
    return () => clearTimeout(initialTimeout);
  }, [show]);

  useEffect(() => {
    if (!visible || !show) return;
    const hideTimeout = setTimeout(() => {
      setVisible(false);
      const nextTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % notifications.length);
        setVisible(true);
      }, 10000);
      return () => clearTimeout(nextTimeout);
    }, 5000);
    return () => clearTimeout(hideTimeout);
  }, [visible, show, notifications.length]);

  return (
    <AnimatePresence>
      {show && visible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-32 md:bottom-12 left-4 md:left-12 z-[140] max-w-[280px] md:max-w-md bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-2xl border border-stone-100 flex items-center gap-4"
        >
          <div className="text-sm md:text-xl font-medium text-stone-700 leading-tight">
            {notifications[index]}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  type = "button"
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit";
}) => {
  const baseStyles = "px-6 md:px-10 py-3 md:py-4 rounded-full font-bold transition-all duration-300 ease-out flex items-center justify-center gap-3 text-lg md:text-xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider";
  const variants = {
    primary: "bg-sage text-white hover:bg-sage-dark shadow-lg shadow-sage/20 hover:shadow-xl hover:shadow-sage/30",
    secondary: "bg-coral text-white hover:bg-coral-dark shadow-lg shadow-coral/20 hover:shadow-xl hover:shadow-coral/30",
    outline: "border-2 border-sage text-sage hover:bg-sage/5"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function App() {
  const [quiz, setQuiz] = useState<QuizState>({ step: 'name', answers: [], userName: '' });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiDiagnosis, setAiDiagnosis] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 44, seconds: 47 });

  // Timer logic for diagnosis page
  useEffect(() => {
    if (quiz.step !== 'diagnosis') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz.step]);

  // Scroll to top ONLY on diagnosis step
  useEffect(() => {
    if (quiz.step === 'diagnosis') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [quiz.step]);

  const quizQuestions = [
    {
      question: () => `Se você pudesse eliminar apenas UM desses problemas hoje para voltar a se sentir "você mesma", qual seria o mais urgente?`,
      options: [
        "Ondas de calor sufocantes e suor repentino",
        "Insônia crônica e cansaço extremo",
        "Ganho de peso inexplicável e inchaço",
        "\"Névoa mental\", esquecimentos e irritabilidade"
      ],
      icon: <Zap className="text-sage" />
    },
    {
      question: () => `Você sente que o seu corpo de repente "pega fogo" por dentro, criando uma pressão que sobe para o rosto, mesmo quando o ambiente está frio?`,
      options: [
        "Sim, isso acontece com frequência e me incomoda muito",
        "Às vezes, principalmente à noite",
        "Raramente"
      ],
      icon: <Flame className="text-coral-text" />
    },
    {
      question: () => `Quando você acorda entre 2h e 4h da manhã com a mente "ligada", você sente que o seu dia seguinte já está "arruinado" pelo cansaço antes mesmo de começar?`,
      options: [
        "Sim, acordo exausta e sem energia para nada",
        "Tento ignorar, mas o cansaço sempre me vence à tarde",
        "Não costumo acordar de madrugada"
      ],
      icon: <Moon className="text-lavender" />
    },
    {
      question: () => `A ciência descobriu que as mulheres de Bama não sofrem com isso porque ativam uma "via adrenal" natural. Você já tentou algum método que focasse em "destravar" o seu sistema nervoso em vez de apenas tentar mascarar os sintomas com chás ou remédios?`,
      options: [
        "Nunca me falaram sobre essa via adrenal",
        "Já tentei de tudo, mas o alívio é sempre temporário",
        "Só conheço os tratamentos hormonais comuns"
      ],
      icon: <Brain className="text-sage-dark" />
    },
    {
      question: () => `Sinceramente, por que você acha que não teve sucesso em controlar esses sintomas de forma definitiva até agora?`,
      options: [
        "Achei que era apenas \"coisa da idade\" e que precisava aguentar",
        "Tenho medo dos efeitos colaterais dos hormônios sintéticos",
        "Nunca nenhum médico me explicou a causa real (o termostato desregulado)",
        "Sinto que meu corpo simplesmente parou de responder"
      ],
      icon: <Brain className="text-sage-dark" />
    },
    {
      question: () => `O Padrão Bama exige 14 dias de reprogramação térmica e alimentar. Você está disposta a investir apenas 5 minutos do seu dia para recuperar anos de serenidade, sono profundo e energia?`,
      options: [
        "Sim, eu mereço recuperar a minha vida!",
        "Estou pronta, quero ver o meu diagnóstico agora."
      ],
      icon: <Clock className="text-sage" />
    }
  ];

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quiz.userName.trim()) {
      setQuiz(prev => ({ ...prev, step: 0 }));
    }
  };

  const handleAnswer = (answer: string) => {
    const currentStep = quiz.step as number;
    const nextStep = currentStep + 1;
    
    if (nextStep === 6) {
      const finalAnswers = [...quiz.answers, answer];
      setQuiz(prev => ({
        ...prev,
        answers: finalAnswers,
        step: 'analyzing'
      }));
      startAnalysis(finalAnswers);
    } else {
      setQuiz(prev => ({
        ...prev,
        answers: [...prev.answers, answer],
        step: nextStep as QuizStep
      }));
    }
  };

  const startAnalysis = async (finalAnswers: string[]) => {
    setIsGenerating(true);
    setAnalysisProgress(0);
    setAiDiagnosis(''); 
    
    const aiFinishedRef = { current: false };
    
    generateDiagnosis(quiz.userName, finalAnswers)
      .then(diagnosis => {
        setAiDiagnosis(diagnosis);
        aiFinishedRef.current = true;
      })
      .catch(error => {
        console.error("AI Diagnosis Error:", error);
        aiFinishedRef.current = true; 
      });

    const safetyTimeout = setTimeout(() => {
      aiFinishedRef.current = true;
    }, 6000);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (aiFinishedRef.current && prev >= 90) {
          clearInterval(interval);
          clearTimeout(safetyTimeout);
          setTimeout(() => {
            setQuiz(prevQuiz => ({ ...prevQuiz, step: 'diagnosis' }));
            setIsGenerating(false);
          }, 400);
          return 100;
        }
        let nextProgress;
        if (prev < 70) nextProgress = prev + (Math.random() * 5 + 3);
        else if (prev < 90) nextProgress = prev + (Math.random() * 2 + 1);
        else if (prev < 99) nextProgress = prev + 0.5;
        else nextProgress = 99;
        return Math.min(nextProgress, 99);
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-cream text-stone-800 font-sans selection:bg-sage/20">
      <NotificationPopup show={quiz.step === 'diagnosis'} />
      
      {/* --- QUIZ HERO SECTION --- */}
      <section id="quiz" className={`relative overflow-hidden ${quiz.step === 'diagnosis' ? 'bg-stone-100 pt-0 pb-20 md:pb-32 px-0 md:px-0' : 'bg-cream py-20 md:py-32 px-4'}`}>
        {quiz.step === 'diagnosis' && (
          <div className="absolute inset-0 opacity-60">
            <img 
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920" 
              alt="Bama Village Mist" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {quiz.step === 'name' ? (
              <motion.div
                key="name-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/95 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 shadow-2xl shadow-stone-900/10 border border-white"
              >
                <p className="text-stone-600 mb-8 md:mb-10 text-lg md:text-xl leading-relaxed italic border-l-4 md:border-l-6 border-sage pl-4 md:pl-8">
                  "O Padrão Bama é o nome dado ao equilíbrio hormonal perfeito encontrado em uma vila isolada na China, onde a menopausa é vivida com total serenidade. Este quiz vai comparar seus sintomas atuais com os biomarcadores de Bama para criar o seu Protocolo da Serenidade personalizado."
                </p>
                <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-8 mb-8 md:mb-10 text-center md:text-left">
                  <div className="p-3 md:p-4 bg-cream rounded-2xl md:rounded-3xl shrink-0">
                    <Heart size={32} className="text-sage md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-serif font-bold text-sage-dark">
                    Antes de começarmos, como podemos te chamar?
                  </h3>
                </div>
                <form onSubmit={handleNameSubmit} className="space-y-6 md:space-y-8">
                  <div className="relative">
                    <input
                       type="text"
                       required
                       placeholder="Seu nome aqui..."
                       value={quiz.userName}
                       onChange={(e) => setQuiz(prev => ({ ...prev, userName: e.target.value }))}
                       className="w-full p-4 md:p-6 text-xl md:text-2xl border-2 md:border-4 border-stone-100 rounded-2xl md:rounded-3xl focus:border-sage focus:ring-0 outline-none transition-all"
                    />
                  </div>
                  <Button type="submit" className="w-full py-4 md:py-6 text-xl md:text-2xl">
                    Iniciar Diagnóstico <ArrowRight size={24} className="md:w-6 md:h-6" />
                  </Button>
                </form>
              </motion.div>
            ) : typeof quiz.step === 'number' ? (
              <motion.div
                key={quiz.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/95 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 shadow-2xl shadow-stone-900/10 border border-white"
              >
                <div className="flex items-center gap-4 md:gap-8 mb-8 md:mb-10">
                  <div className="p-3 md:p-4 bg-cream rounded-2xl md:rounded-3xl shrink-0">
                    {React.cloneElement(quizQuestions[quiz.step].icon as React.ReactElement, { size: 32, className: (quizQuestions[quiz.step].icon as React.ReactElement).props.className + " md:w-8 md:h-8" })}
                  </div>
                  <div className="flex-1 h-3 md:h-4 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sage transition-all duration-500" 
                      style={{ width: `${((quiz.step + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-stone-400 tracking-tighter shrink-0">
                    {quiz.step + 1}/{quizQuestions.length}
                  </span>
                </div>

                <h3 className="text-xl md:text-3xl font-serif font-bold text-sage-dark mb-8 leading-tight">
                  {quizQuestions[quiz.step].question()}
                </h3>

                <div className="grid gap-4 md:gap-6">
                  {quizQuestions[quiz.step].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-4 md:p-6 text-left rounded-2xl md:rounded-[1.5rem] border-2 border-stone-200 hover:border-sage hover:bg-sage/5 hover:shadow-xl transition-all duration-300 group flex items-center justify-between gap-4 md:gap-6"
                    >
                      <span className="text-lg md:text-xl font-medium text-stone-700 group-hover:text-sage-dark leading-snug">{option}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-stone-200 group-hover:border-sage group-hover:bg-sage flex items-center justify-center transition-colors shrink-0">
                        <CheckCircle2 size={18} className="text-white opacity-0 group-hover:opacity-100 md:w-5 md:h-5" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : quiz.step === 'analyzing' ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/95 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-stone-900/10 border border-white text-center"
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-8 md:mb-10">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-stone-100"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="282.7"
                      strokeDashoffset={282.7 - (282.7 * analysisProgress) / 100}
                      className="text-sage transition-all duration-100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl md:text-5xl font-bold text-sage-dark">{Math.round(analysisProgress)}%</span>
                  </div>
                </div>
                <h3 className="text-2xl md:text-5xl font-serif font-bold text-sage-dark mb-8 leading-tight">
                  {analysisProgress < 40 
                    ? "Cruzando seus sintomas com os Biomarcadores de Bama..." 
                    : analysisProgress < 80 
                      ? "Calculando a dosagem de nutrientes para o seu Protocolo da Serenidade..." 
                      : "Diagnóstico Concluído. Você é compatível com o Ritual de 14 dias."}
                </h3>
                <p className="text-stone-500 italic text-xl md:text-3xl">Processando suas respostas com o Código de Bama...</p>
              </motion.div>
            ) : (
              <motion.div
                key="diagnosis"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, scale: 0.98 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: 0.5 }
                  }
                }}
                className="bg-white text-stone-800"
              >
                {/* Countdown Timer Bar */}
                <div className="bg-[#FFF9F0] py-3 px-4 border-b border-amber-100 sticky top-0 z-[110] shadow-sm">
                  <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-[12px] md:text-base font-black text-amber-900 uppercase tracking-tight text-center md:text-left leading-tight">
                      ⚠️ OPORTUNIDADE ÚNICA: O SEU DIAGNÓSTICO PERSONALIZADO EXPIRA EM:
                    </p>
                    <div className="flex items-center gap-2 bg-amber-100/50 px-3 py-1 rounded-lg border border-amber-200">
                      <Clock size={14} className="text-amber-700" />
                      <span className="font-mono font-bold text-amber-900 text-sm md:text-base">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                <div 
                  className="diagnosis-container"
                  dangerouslySetInnerHTML={{ __html: aiDiagnosis }} 
                />

                {/* Offer Zone (Static part of the template) */}
                <div className="diagnosis-container">
                  <div className="sec-cream">
                    <div className="wrap" id="oferta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h2 style={{ fontSize: 'clamp(20px,3vw,30px)', textAlign: 'center', marginBottom: '8px', fontWeight: 700 }}>Aqui está tudo que você recebe hoje</h2>
                      <p style={{ textAlign: 'center', color: '#666', fontFamily: 'Arial, sans-serif', fontSize: '15px', marginBottom: '32px' }}>Acesso imediato. Vitalício. Sem mensalidade.</p>

                      <div className="offer-zone">
                        <div className="offer-tag">Protocolo da Serenidade — Pacote Completo</div>
                        <div className="offer-title">O Reset de 14 Dias + Todos os Bônus</div>

                        <ul className="items">
                          <li>
                            <span className="ck">✓</span>
                            <div>
                              <span className="item-name">Guia do Reset Térmico — Fase 1 <span className="was-tag">R$ 97</span></span>
                              <span className="item-sub">O ritual matinal de 12 min com o Método R.E.S.E.T. completo — cada passo com o porquê fisiológico</span>
                            </div>
                          </li>
                          <li>
                            <span className="ck">✓</span>
                            <div>
                              <span className="item-name">Cardápio da Blindagem de Bama — Fase 2 <span className="was-tag">R$ 67</span></span>
                              <span className="item-sub">14 dias completos de refeições — café, lanche, almoço, jantar, ceia — com substituições e preparo antecipado</span>
                            </div>
                          </li>
                          <li>
                            <span className="ck">✓</span>
                            <div>
                              <span className="item-name">Técnica do Interruptor Térmico™ <span className="was-tag">R$ 47</span></span>
                              <span className="item-sub">A sequência de 30 segundos para desarmar qualquer crise na hora — use onde estiver</span>
                            </div>
                          </li>
                          <li>
                            <span className="ck">✓</span>
                            <div>
                              <span className="item-name">Os 7 Gatilhos Ocultos <span className="was-tag">R$ 37</span></span>
                              <span className="item-sub">O mapa dos hábitos diários que mantêm o hipotálamo em alerta — e como desativá-los</span>
                            </div>
                          </li>
                          <li>
                            <span className="ck">✓</span>
                            <div>
                              <span className="item-name">🎁 Ritual Noturno de 12 Minutos para o Sono <span className="was-tag">R$ 57</span> <span className="bonus-tag">BÔNUS</span></span>
                              <span className="item-sub">4 passos (resfriamento, respiração, relaxamento muscular e foco) para o sono reparador — exclusivo neste lote</span>
                            </div>
                          </li>
                          <li>
                            <span className="ck">✓</span>
                            <div>
                              <span className="item-name">🎁 O Paradoxo do Estrogênio — Guia Completo <span className="was-tag">R$ 47</span> <span className="bonus-tag">BÔNUS</span></span>
                              <span className="item-sub">Como ativar a produção natural de estrogênio pelas adrenais — o guia que aprofunda e complementa o protocolo</span>
                            </div>
                          </li>
                        </ul>

                        <div className="price-block">
                          <div className="total-line">Valor total do pacote: <s>R$ 352,00</s> por</div>
                          <div className="price-big">R$ 47,90</div>
                          <div className="price-note">Pagamento único · Menos que um jantar fora · Acesso imediato e vitalício</div>
                        </div>

                        <div className="arrow-down">▼ ▼ ▼</div>

                        <div className="btn-wrap">
                          <a href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" target="_blank" rel="noopener noreferrer" className="btn">
                            👉 SIM! QUERO MEU RESET DE 14 DIAS AGORA — R$ 47,90
                            <small>Clique para garantir acesso imediato com todos os bônus.</small>
                          </a>
                        </div>

                        <div className="trust-bar" style={{ marginTop: '12px' }}>
                          <span className="trust-item">🔒 Pagamento 100% seguro</span>
                          <span className="trust-item">📧 Acesso imediato por e-mail</span>
                          <span className="trust-item">🛡️ 7 dias de garantia</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ (Moving FAQ to App.tsx for better control) */}
                  <div style={{ padding: '52px 0', background: '#faf8f4' }}>
                    <div className="wrap">
                      <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: '28px', fontWeight: 700 }}>Perguntas frequentes</h2>
                      <details>
                        <summary>Funciona mesmo se meu problema principal é névoa mental — e não calorões?</summary>
                        <p>Sim — especialmente para esse perfil. A névoa mental, o esquecimento e a irritabilidade são causados pelo mesmo mecanismo que os calorões: o hipotálamo em Modo de Sobrevivência. O Reset Térmico age diretamente nessa origem.</p>
                      </details>
                      <details>
                        <summary>Preciso parar algum tratamento médico para usar o protocolo?</summary>
                        <p>Não. O protocolo é 100% natural e não interfere com nenhuma medicação. Consulte sempre seu médico.</p>
                      </details>
                      <details>
                        <summary>Como acesso o material após a compra?</summary>
                        <p>Imediatamente após a confirmação do pagamento você recebe o link de acesso por e-mail.</p>
                      </details>
                      <details>
                        <summary>E se não funcionar para mim?</summary>
                        <p>Você tem 7 dias de garantia incondicional. Basta enviar um e-mail e eu devolvo 100% do valor.</p>
                      </details>
                    </div>
                  </div>

                  {/* Final CTA */}
                  <div style={{ padding: '52px 0', background: '#fff' }}>
                    <div className="wrap">
                      <h2 className="mini-head" style={{ textAlign: 'center', marginBottom: '16px' }}>Você chegou até aqui por um motivo.</h2>
                      <p className="center">A névoa, o cansaço, a irritabilidade que você sente — você sabe que isso não é "só a menopausa". A decisão de R$ 47,90 é o que separa esses dois futuros.</p>
                      <div className="arrow-down" style={{ margin: '20px 0 8px' }}>▼ ▼ ▼</div>
                      <div className="btn-wrap">
                        <a href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '18px' }}>
                          👉 QUERO MEU RESET DE 14 DIAS — R$ 47,90
                          <small>Acesso imediato · 7 dias de garantia incondicional · Risco zero</small>
                        </a>
                      </div>
                    </div>
                  </div>

                  <footer>
                    <p>Protocolo da Serenidade &nbsp;·&nbsp; Produto 100% Digital &nbsp;·&nbsp; © 2026 Todos os direitos reservados.</p>
                    <p style={{ marginTop: '8px', fontSize: '14px', color: '#444' }}>Este produto não substitui acompanhamento médico profissional. Consulte seu médico antes de iniciar qualquer mudança na dieta ou estilo de vida.</p>
                  </footer>
                </div>

                {/* Sticky Bottom Button */}
                <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-stone-200 z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                  <div className="max-w-md mx-auto text-center">
                    <p className="text-[12px] font-sans text-stone-500 mb-2 flex items-center justify-center gap-1 uppercase font-bold tracking-wider">
                      🔒 PAGAMENTO SEGURO | ACESSO IMEDIATO
                    </p>
                    <a 
                      href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block bg-[#1a6e35] text-white text-center py-4 px-2 rounded-full text-sm md:text-lg font-black hover:bg-[#145228] transition-all shadow-lg shadow-green-900/20 active:translate-y-1 uppercase tracking-tight"
                    >
                      👉 SIM! QUERO MINHA DIREÇÃO E MEU RESET DE 14 DIAS — R$ 47,90
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
