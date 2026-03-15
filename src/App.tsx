/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-1 mt-4">
      <span className="text-coral font-black text-xs md:text-sm uppercase tracking-[0.3em] animate-bounce">Oferta somente hoje</span>
      <div className="flex items-center gap-3 text-coral font-mono font-bold text-3xl md:text-5xl bg-coral/5 px-6 py-3 rounded-2xl border border-coral/20">
        <Clock size={32} className="animate-pulse" />
        <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

// --- Components ---

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
  const baseStyles = "px-10 py-5 rounded-full font-bold transition-all duration-300 ease-out flex items-center justify-center gap-2 text-lg hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider";
  const variants = {
    primary: "bg-sage text-white hover:bg-sage-dark shadow-lg shadow-sage/20 hover:shadow-xl hover:shadow-sage/30",
    secondary: "bg-coral text-white hover:bg-[#ff6b3d] shadow-lg shadow-coral/20 hover:shadow-xl hover:shadow-coral/30",
    outline: "border-2 border-sage text-sage hover:bg-sage/5"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const SectionTitle = ({ children, subtitle, light = false }: { children: React.ReactNode; subtitle?: string; light?: boolean }) => (
  <div className="text-center mb-12 md:mb-24 px-4">
    <h2 className={`text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6 leading-[1.1] tracking-tight ${light ? 'text-white' : 'text-sage-dark'}`}>{children}</h2>
    {subtitle && <p className={`text-base md:text-xl max-w-2xl mx-auto italic ${light ? 'text-stone-300' : 'text-stone-500'}`}>{subtitle}</p>}
    <div className={`w-16 md:w-20 h-1 mx-auto mt-6 md:mt-8 rounded-full ${light ? 'bg-coral' : 'bg-sage'}`} />
  </div>
);

export default function App() {
  const [quiz, setQuiz] = useState<QuizState>({ step: 'name', answers: [], userName: '' });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiDiagnosis, setAiDiagnosis] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Scroll to top ONLY on diagnosis step
  useEffect(() => {
    if (quiz.step === 'diagnosis') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [quiz.step]);

  const quizQuestions = [
    {
      question: (name: string) => `${name}, se você pudesse eliminar apenas UM desses problemas hoje para voltar a se sentir "você mesma", qual seria o mais urgente?`,
      options: [
        "Ondas de calor sufocantes e suor repentino",
        "Insônia crônica e cansaço extremo",
        "Ganho de peso inexplicável e inchaço",
        "\"Névoa mental\", esquecimentos e irritabilidade"
      ],
      icon: <Zap className="text-sage" />
    },
    {
      question: (name: string) => `Você sente que o seu corpo de repente "pega fogo" por dentro, criando uma pressão que sobe para o rosto, mesmo quando o ambiente está frio?`,
      options: [
        "Sim, isso acontece com frequência e me incomoda muito",
        "Às vezes, principalmente à noite",
        "Raramente"
      ],
      icon: <Flame className="text-coral" />
    },
    {
      question: (name: string) => `Quando você acorda entre 2h e 4h da manhã com a mente "ligada", você sente que o seu dia seguinte já está "arruinado" pelo cansaço antes mesmo de começar?`,
      options: [
        "Sim, acordo exausta e sem energia para nada",
        "Tento ignorar, mas o cansaço sempre me vence à tarde",
        "Não costumo acordar de madrugada"
      ],
      icon: <Moon className="text-lavender" />
    },
    {
      question: (name: string) => `A ciência descobriu que as mulheres de Bama não sofrem com isso porque ativam uma "via adrenal" natural. Você já tentou algum método que focasse em "destravar" o seu sistema nervoso em vez de apenas tentar mascarar os sintomas com chás ou remédios?`,
      options: [
        "Nunca me falaram sobre essa via adrenal",
        "Já tentei de tudo, mas o alívio é sempre temporário",
        "Só conheço os tratamentos hormonais comuns"
      ],
      icon: <Brain className="text-sage-dark" />
    },
    {
      question: (name: string) => `Sinceramente, por que você acha que não teve sucesso em controlar esses sintomas de forma definitiva até agora?`,
      options: [
        "Achei que era apenas \"coisa da idade\" e que precisava aguentar",
        "Tenho medo dos efeitos colaterais dos hormônios sintéticos",
        "Nunca nenhum médico me explicou a causa real (o termostato desregulado)",
        "Sinto que meu corpo simplesmente parou de responder"
      ],
      icon: <Brain className="text-sage-dark" />
    },
    {
      question: (name: string) => `O Padrão Bama exige 14 dias de reprogramação térmica e alimentar. Você está disposta a investir apenas 5 minutos do seu dia para recuperar anos de serenidade, sono profundo e energia?`,
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
    setAiDiagnosis(''); // Reset previous diagnosis
    
    const aiFinishedRef = { current: false };
    
    // Start AI call immediately in the background
    generateDiagnosis(quiz.userName, finalAnswers)
      .then(diagnosis => {
        setAiDiagnosis(diagnosis);
        aiFinishedRef.current = true;
      })
      .catch(error => {
        console.error("AI Diagnosis Error:", error);
        aiFinishedRef.current = true; // Still finish to allow user to see results
      });

    // Safety timeout: if AI takes more than 12 seconds, force completion
    const safetyTimeout = setTimeout(() => {
      aiFinishedRef.current = true;
    }, 12000);

    // Progress bar animation logic
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        // If AI is done, jump to 100 and clear interval
        if (aiFinishedRef.current && prev >= 90) {
          clearInterval(interval);
          clearTimeout(safetyTimeout);
          
          // Final transition
          setTimeout(() => {
            setQuiz(prevQuiz => ({ ...prevQuiz, step: 'diagnosis' }));
            setIsGenerating(false);
          }, 800);
          
          return 100;
        }

        // Natural progress curve
        let nextProgress;
        if (prev < 70) {
          nextProgress = prev + (Math.random() * 3 + 1.5); // Faster initial progress
        } else if (prev < 90) {
          nextProgress = prev + (Math.random() * 0.8 + 0.3); // Slower
        } else if (prev < 99) {
          nextProgress = prev + 0.1; // Slow crawl at the end
        } else {
          nextProgress = 99;
        }

        return Math.min(nextProgress, 99);
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-cream text-stone-800 font-sans selection:bg-sage/20">
      {/* --- QUIZ HERO SECTION --- */}
      <section id="quiz" className={`relative py-20 md:py-32 px-4 overflow-hidden ${quiz.step === 'diagnosis' ? 'bg-stone-100' : 'bg-sage-dark'}`}>
        <div className={`absolute inset-0 ${quiz.step === 'diagnosis' ? 'opacity-60' : 'opacity-20'}`}>
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920" 
            alt="Bama Village Mist" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative max-w-5xl mx-auto z-10">
          {quiz.step !== 'diagnosis' && (
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold mb-6 uppercase tracking-[0.2em]">
                  O Segredo de Bama
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight mb-6 text-white">
                  O Segredo de Bama: Como mulheres de 90 anos na China silenciaram os sintomas da menopausa <span className="text-coral italic">(sem usar um único hormônio sintético)</span>.
                </h1>
                <p className="text-base md:text-xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-light px-2">
                  Descubra seu perfil hormonal e ative seu <strong>'Paradoxo do Estrogênio'</strong> para resetar seu metabolismo e seu sono em apenas 14 dias.
                </p>
              </motion.div>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {quiz.step === 'name' ? (
              <motion.div
                key="name-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/95 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 shadow-2xl shadow-stone-900/10 border border-white"
              >
                <p className="text-stone-600 mb-8 md:mb-10 text-base md:text-lg leading-relaxed italic border-l-4 border-sage pl-4 md:pl-6">
                  "O Padrão Bama é o nome dado ao equilíbrio hormonal perfeito encontrado em uma vila isolada na China, onde a menopausa é vivida com total serenidade. Este quiz vai comparar seus sintomas atuais com os biomarcadores de Bama para criar o seu Protocolo da Serenidade personalizado."
                </p>
                <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
                  <div className="p-3 md:p-4 bg-cream rounded-2xl shrink-0">
                    <Heart className="text-sage" />
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
                      className="w-full p-4 md:p-6 text-lg md:text-xl border-2 border-stone-100 rounded-2xl focus:border-sage focus:ring-0 outline-none transition-all"
                    />
                  </div>
                  <Button type="submit" className="w-full py-5 md:py-6">
                    Iniciar Diagnóstico <ArrowRight size={20} />
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
                <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                  <div className="p-3 md:p-4 bg-cream rounded-2xl shrink-0">
                    {quizQuestions[quiz.step].icon}
                  </div>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sage transition-all duration-500" 
                      style={{ width: `${((quiz.step + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-stone-400 tracking-tighter shrink-0">
                    {quiz.step + 1}/{quizQuestions.length}
                  </span>
                </div>

                <h3 className="text-xl md:text-4xl font-serif font-bold text-sage-dark mb-8 md:mb-12 leading-tight">
                  {quizQuestions[quiz.step].question(quiz.userName)}
                </h3>

                <div className="grid gap-3 md:gap-5">
                  {quizQuestions[quiz.step].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-4 md:p-6 text-left rounded-2xl border border-stone-200 hover:border-sage hover:bg-sage/5 hover:shadow-md transition-all duration-300 group flex items-center justify-between gap-4"
                    >
                      <span className="text-base md:text-lg font-medium text-stone-700 group-hover:text-sage-dark leading-snug">{option}</span>
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-stone-200 group-hover:border-sage group-hover:bg-sage flex items-center justify-center transition-colors shrink-0">
                        <CheckCircle2 size={14} className="text-white opacity-0 group-hover:opacity-100" />
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
                <h3 className="text-xl md:text-3xl font-serif font-bold text-sage-dark mb-4 leading-tight">
                  {analysisProgress < 40 
                    ? "Cruzando seus sintomas com os Biomarcadores de Bama..." 
                    : analysisProgress < 80 
                      ? "Calculando a dosagem de nutrientes para o seu Protocolo da Serenidade..." 
                      : "Diagnóstico Concluído. Você é compatível com o Ritual de 14 dias."}
                </h3>
                <p className="text-stone-500 italic text-base md:text-lg">Processando suas respostas com o Código de Bama, {quiz.userName}.</p>
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
                    transition: { 
                      duration: 0.5,
                      when: "beforeChildren",
                      staggerChildren: 0.2
                    }
                  }
                }}
                className="bg-sage text-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-stone-900/20 border border-white/10"
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex items-center gap-3 text-white/80 font-bold tracking-[0.2em] mb-6 uppercase text-sm"
                >
                  <Zap size={20} className="text-coral" /> DIAGNÓSTICO PERSONALIZADO CONCLUÍDO
                </motion.div>
                
                <motion.h3 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-2xl md:text-5xl font-serif font-bold mb-6 md:mb-8 leading-tight text-white"
                >
                  {quiz.userName}, seu corpo está sequestrado pelo "Modo de Sobrevivência".
                </motion.h3>

                <div className="space-y-6 md:space-y-8 mb-10 md:mb-14">
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-xl backdrop-blur-sm"
                  >
                    <div className="text-lg md:text-xl text-stone-200 leading-relaxed font-light space-y-6">
                      {aiDiagnosis ? (
                        aiDiagnosis.split('\n').map((line, i) => (
                          <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ))
                      ) : (
                        <>
                          <p>Olá, {quiz.userName}. A análise das suas respostas indica que {
                            quiz.answers[4] === "Sinto que meu corpo simplesmente parou de responder" 
                              ? "o seu metabolismo não está apenas lento; ele está bloqueado." 
                              : quiz.answers[4]?.includes("coisa da idade")
                              ? "você foi levada a acreditar que isso é 'normal da idade', mas seu corpo está apenas em sinal de pânico."
                              : "o seu metabolismo está operando em um modo de emergência constante."
                          }</p>
                          <p>{
                            quiz.answers[0]?.includes("Ondas de calor") ? "As ondas de calor e o suor excessivo" :
                            quiz.answers[0]?.includes("Insônia") ? "As noites mal dormidas e o cansaço crônico" :
                            quiz.answers[0]?.includes("Névoa mental") ? "A névoa mental e a falta de foco" :
                            quiz.answers[0]?.includes("Ganho de peso") ? "O inchaço abdominal e o ganho de peso repentino" :
                            "O desconforto e o cansaço"
                          } que você sente não são apenas sintomas comuns, mas sim uma <strong>"inflamação de sobrevivência"</strong>. Com a queda hormonal, seu Hipotálamo — o termostato do seu corpo — entrou em sinal de pânico. Ele parou de queimar energia para tentar "estocar" gordura como proteção.</p>
                          <p>{
                            quiz.answers[2] !== "Não costumo acordar de madrugada"
                              ? `É por isso que você acorda entre 2h e 4h da manhã e sente esse desconforto súbito: seu sistema está tentando se recalibrar sozinho, sem as ferramentas certas.`
                              : quiz.answers[0]?.includes("Ondas de calor")
                              ? `É por isso que esses calorões surgem do nada: seu sistema está tentando se recalibrar sozinho, mas sem as ferramentas certas, ele acaba gerando esse "curto-circuito" térmico.`
                              : `É por isso que você se sente constantemente exausta: seu sistema está tentando se recalibrar sozinho, mas sem as ferramentas certas, ele permanece travado nesse modo de alerta.`
                          }</p>
                        </>
                      )}
                    </div>
                  </motion.div>

                  {/* [BLOCO DE ALÍVIO RÁPIDO - NOVO!] */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="bg-coral/10 border border-coral/20 p-8 md:p-10 rounded-[2.5rem] shadow-xl"
                  >
                    <h4 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">O que você precisa agora não é de dieta, é de um RESET.</h4>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 text-stone-200">
                        <div className="w-8 h-8 bg-coral/20 rounded-full flex items-center justify-center text-coral shrink-0">✓</div>
                        <p className="text-lg md:text-xl"><strong>Método 100% Natural:</strong> Sem hormônios sintéticos ou efeitos colaterais.</p>
                      </div>
                      <div className="flex items-center gap-4 text-stone-200">
                        <div className="w-8 h-8 bg-coral/20 rounded-full flex items-center justify-center text-coral shrink-0">✓</div>
                        <p className="text-lg md:text-xl"><strong>Apenas 12 minutos:</strong> Rituais simples que cabem na sua rotina exausta.</p>
                      </div>
                      <div className="flex items-center gap-4 text-stone-200">
                        <div className="w-8 h-8 bg-coral/20 rounded-full flex items-center justify-center text-coral shrink-0">✓</div>
                        <p className="text-lg md:text-xl"><strong>Alívio em 7 dias:</strong> Sinta a primeira noite de sono profundo já na primeira semana.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* [BOTÃO DE AÇÃO IMEDIATA (ACIMA DA DOBRA)] */}
                <div className="space-y-4">
                  <Button 
                    variant="secondary" 
                    className="w-full py-7 text-xl shadow-coral/40 bg-coral hover:bg-coral-dark animate-pulse"
                    onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    👉 QUERO SILENCIAR MEUS SINTOMAS EM 14 DIAS
                  </Button>
                  <p className="text-center text-white font-bold text-lg">
                    Acesso imediato ao Protocolo da Serenidade por apenas <span className="text-coral">R$ 27,90</span>
                  </p>
                </div>
                <p className="mt-4 text-center text-stone-400 text-xs font-bold uppercase tracking-widest">
                  Acesso Imediato • Produto Digital (E-book)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>

    {quiz.step === 'diagnosis' && (
      <>
        {/* --- STORY SECTION (BLOCK 3) --- */}
        <section id="story" className="py-24 md:py-32 px-4 bg-cream/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-900/10">
                <img 
                  src="https://i.ibb.co/LXwZr23J/Untitled-design-6.png" 
                  alt="O Segredo de Bama" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 md:-right-8 bg-sage/95 backdrop-blur-md text-white p-8 md:p-10 rounded-[2rem] shadow-xl max-w-xs border border-white/20">
                <p className="font-serif italic text-xl leading-relaxed">
                  "O Segredo do Vale da Longevidade"
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-sage-dark mb-6 md:mb-10 leading-[1.1] tracking-tight">
                O Segredo do <span className="italic text-coral">"Vale da Longevidade"</span>
              </h2>
              <div className="space-y-6 md:space-y-8 text-lg md:text-xl text-stone-600 leading-relaxed font-light">
                <p>
                  Nas montanhas isoladas de Bama, na China, mulheres de 60 anos têm a vitalidade de jovens de 30. Elas não são "abençoadas", elas apenas mantêm a Via Adrenal ativa.
                </p>
                <p>
                  O Protocolo da Serenidade é o único mapa que traduz o estilo de vida dessas mulheres para a nossa realidade moderna. É uma atualização de "software" para o seu corpo que neutraliza os sinais de pânico do seu cérebro em questão de dias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNIQUES SECTION (BLOCK 4 - PART 2) --- */}
      <section className="py-32 px-4 bg-sage-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle light subtitle="O que vai acontecer nos próximos 14 dias:">
            O Seu Plano de Transformação
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Alívio Rápido",
                desc: "Você aplicará o \"Interruptor Térmico\" para neutralizar calorões instantaneamente.",
                icon: <Flame className="text-coral" />,
                tag: "Dia 1-3"
              },
              {
                title: "Sono Profundo",
                desc: "O Ritual de 12 Minutos estabilizará sua glicose para um sono sem interrupções.",
                icon: <Moon className="text-lavender" />,
                tag: "Dia 4-7"
              },
              {
                title: "Plano Alimentar",
                desc: "Você saberá exatamente quais ingredientes baratos ativam o Padrão Bama no seu prato.",
                icon: <Scale className="text-sage" />,
                tag: "Dia 8-14"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-10 rounded-[2rem] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 bg-white/5 px-3 py-1 rounded-full">{item.tag}</span>
                </div>
                <h4 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4">{item.title}</h4>
                <p className="text-sm md:text-base text-stone-300 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION (BLOCK 4 - PART 1) --- */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="A Vida Após o Reset de 14 Dias:">
            Histórias de Transformação
          </SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "As ondas de calor quase sumiram!",
                text: "Eu não aguentava mais trocar de roupa três vezes por noite. O Protocolo me mostrou <strong>como enganar meu hipotálamo</strong>. Hoje, as ondas de calor quase sumiram!",
                author: "Cláudia, 54 anos"
              },
              {
                title: "Meu marido notou a diferença!",
                text: "Eu vivia em uma <strong>névoa mental</strong>. O Ritual Noturno me devolveu o sono e a minha paciência. Meu marido notou a diferença logo na primeira semana!",
                author: "Patrícia, 49 anos"
              },
              {
                title: "Até meu médico aprovou!",
                text: "Eu decidi tentar o plano de 14 dias antes de ir para medicamentos pesados. Meu médico ficou <strong>impressionado com minha energia nos exames</strong> e mandou eu continuar.",
                author: "Sandra, 57 anos"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-cream/30 p-8 md:p-10 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex gap-1 mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} size={14} className="fill-coral text-coral" />
                  ))}
                </div>
                <h4 className="text-lg md:text-xl font-serif font-bold text-sage-dark mb-3 md:mb-4">"{item.title}"</h4>
                <p className="text-base md:text-lg text-stone-600 leading-relaxed mb-6 md:mb-8 font-light italic" dangerouslySetInnerHTML={{ __html: `"${item.text}"` }} />
                <div className="pt-4 md:pt-6 border-t border-stone-100">
                  <p className="font-bold text-sage-dark text-xs md:text-sm uppercase tracking-wider">— {item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OFFER SECTION (BLOCK 5) --- */}
      <section id="offer" className="py-32 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-stone-100">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-8 md:p-20 bg-sage text-white">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 md:mb-8">Missão de Resgate à Vitalidade Feminina</h2>
                <div className="space-y-6 md:space-y-8 text-lg md:text-xl leading-relaxed font-light">
                  <p className="text-2xl md:text-3xl font-serif font-bold text-coral-light mb-8">Por que custa apenas R$ 27,90?</p>
                  <p>
                    Se você fosse buscar esse suporte em clínicas particulares, o custo seria proibitivo:
                  </p>
                  <div className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-center">
                      <span>Consulta Integrativa Especializada:</span>
                      <span className="line-through text-white/50">R$ 800,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Suplementos e Vitaminas Sintéticas:</span>
                      <span className="line-through text-white/50">R$ 250,00</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center text-2xl font-bold">
                      <span>Seu Investimento Hoje:</span>
                      <span className="text-coral">R$ 27,90</span>
                    </div>
                  </div>
                  <p>
                    Fizemos esse preço simbólico porque nossa missão é que nenhuma mulher precise sofrer por falta de acesso à informação correta.
                  </p>
                </div>
                
                <div className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-white/20">
                  <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6">O que você recebe hoje:</h4>
                  <div className="grid gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-coral rounded-full flex items-center justify-center font-bold text-xs md:text-sm shrink-0">✓</div>
                      <p className="text-base md:text-lg">Protocolo da Serenidade Completo</p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-coral rounded-full flex items-center justify-center font-bold text-xs md:text-sm shrink-0">✓</div>
                      <p className="text-base md:text-lg">Plano Alimentar de 14 Dias</p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-coral rounded-full flex items-center justify-center font-bold text-xs md:text-sm shrink-0">✓</div>
                      <p className="text-base md:text-lg">Acesso Vitalício e Bônus Exclusivos</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 p-8 md:p-16 flex flex-col justify-center items-center text-center bg-gradient-to-b from-stone-50 to-stone-100/50">
                <div className="mb-8 md:mb-10">
                  <span className="inline-block px-4 py-1.5 bg-coral/10 text-coral font-bold rounded-full text-[10px] md:text-sm tracking-widest uppercase mb-2">
                    Acesso Imediato • 100% Digital
                  </span>
                  <CountdownTimer />
                  <div className="flex flex-col items-center justify-center mt-6">
                    <span className="text-stone-400 line-through text-xl md:text-2xl font-medium">De: R$ 97,00</span>
                    <div className="text-xl md:text-2xl font-bold text-sage-dark mt-2">Por apenas:</div>
                    <div className="text-6xl md:text-8xl font-bold text-coral mt-2 tracking-tight">
                      R$ 27<span className="text-3xl md:text-5xl">,90</span>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="secondary" className="w-full py-6 md:py-8 text-lg md:text-xl shadow-coral/30 bg-coral hover:bg-coral-dark">
                    👉 SIM! QUERO INICIAR MEU PROTOCOLO DE 14 DIAS AGORA
                  </Button>
                </a>

                <p className="mt-6 text-stone-500 text-xs font-bold uppercase tracking-widest">
                  Acesso imediato via e-mail • Produto Digital
                </p>
                
                <div className="mt-12 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3 text-stone-400">
                    <ShieldCheck size={24} />
                    <span className="text-sm font-medium">Pagamento 100% Seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- GUARANTEE (BLOCK 6) --- */}
          <div className="mt-16 md:mt-20 max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-stone-100 flex flex-col md:flex-row items-center gap-8 md:gap-10">
            <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1000/1000951.png" 
                alt="Garantia" 
                className="w-full h-full object-contain opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-3xl font-serif font-bold text-sage-dark mb-3 md:mb-4">7 DIAS DE RISCO ZERO</h3>
              <p className="text-base md:text-lg text-stone-600 leading-relaxed font-light">
                Siga o plano. Se em 7 dias você não sentir suas ondas de calor diminuindo e seu sono voltando ao normal, eu não quero o seu dinheiro. Basta um e-mail e devolvo 100% do valor. O risco está todo comigo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTitle subtitle="Conheça a equipe por trás do Protocolo da Serenidade">
            Uma Missão de Resgate à Vitalidade Feminina
          </SectionTitle>
          <div className="bg-cream/50 p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border border-stone-100">
            <p className="text-lg md:text-xl text-stone-700 font-medium mb-6 md:mb-8 italic">
              "Nós entendemos a frustração de se sentir uma estranha no próprio corpo. Por isso, decodificamos o método que mantém as mulheres de Bama vibrantes há gerações."
            </p>
            <p className="text-base md:text-xl text-stone-600 leading-relaxed font-light italic">
              O Protocolo da Serenidade não nasceu em laboratórios farmacêuticos, mas sim de uma busca incessante por respostas que a medicina convencional muitas vezes ignora. Somos um coletivo de pesquisadores independentes, nutricionistas e especialistas em saúde integrativa, apaixonados pela biologia da longevidade.
            </p>
            <p className="text-base md:text-xl text-stone-600 leading-relaxed font-light italic mt-6 md:mt-8">
              Nossa equipe dedicou anos estudando o 'Paradoxo do Estrogênio' e as zonas azuis do mundo — como a Vila de Bama — para traduzir segredos ancestrais em um método prático de 14 dias. Nosso objetivo é claro: dar a cada mulher o mapa para que ela não seja refém dos seus hormônios, mas sim a mestre do seu próprio bem-estar.
            </p>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION (BLOCK 7) --- */}
      <section className="py-20 md:py-24 px-4 bg-sage-dark text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-serif font-bold mb-6 md:mb-8 px-2">
            "{quiz.userName}, a decisão agora é sua."
          </h2>
          
          <div className="space-y-8 md:space-y-12 text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl mb-8">Neste momento, você tem dois caminhos à sua frente:</p>
            
            <div className="text-left bg-white/5 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/10">
              <h4 className="text-2xl md:text-3xl font-serif font-bold text-coral mb-4 md:mb-6">Opção 1:</h4>
              <p className="text-base md:text-lg lg:text-xl text-stone-300 leading-relaxed">
                Ignorar este diagnóstico e continuar {
                  quiz.answers[0]?.includes("Ondas de calor") ? "sofrendo com os calorões súbitos e o suor excessivo" :
                  quiz.answers[0]?.includes("Insônia") ? "passando noites em claro e acordando exausta" :
                  quiz.answers[0]?.includes("Névoa mental") ? "lutando contra a falta de foco e o esquecimento" :
                  quiz.answers[0]?.includes("Ganho de peso") ? "vendo o ponteiro da balança subir sem controle" :
                  "enfrentando esses sintomas que drenam sua energia"
                }. Mas você sabe que, se nada mudar, a inflamação só vai aumentar.
              </p>
            </div>

            <div className="text-left bg-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-xl">
              <h4 className="text-2xl md:text-3xl font-serif font-bold text-sage mb-4 md:mb-6">Opção 2:</h4>
              <p className="text-base md:text-lg lg:text-xl text-white leading-relaxed">
                Ativar o Padrão Bama hoje mesmo. Silenciar os sinais de pânico do seu corpo e recuperar {
                  quiz.answers[0]?.includes("Ondas de calor") ? "o controle térmico do seu organismo" :
                  quiz.answers[0]?.includes("Insônia") ? "o sono profundo e reparador" :
                  quiz.answers[0]?.includes("Névoa mental") ? "a clareza mental e a disposição" :
                  quiz.answers[0]?.includes("Ganho de peso") ? "o seu peso ideal e a autoestima" :
                  "a vitalidade e o bem-estar"
                } que você merece.
              </p>
            </div>

            <div className="pt-6 md:pt-8">
              <p className="text-lg md:text-xl font-light mb-4">
                Eu não sei por quanto tempo conseguirei manter esse valor de R$ 27,90, já que os custos de manutenção da plataforma estão subindo.
              </p>
              <p className="text-xl md:text-2xl font-serif font-bold text-coral">
                Clique no botão abaixo e escolha a Opção 2.
              </p>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <a 
              href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full max-w-xl"
            >
              <Button variant="secondary" className="w-full py-6 md:py-8 text-lg md:text-xl shadow-coral/40 bg-coral hover:bg-coral-dark">
                SIM! QUERO ATIVAR MEU PADRÃO BAMA
              </Button>
            </a>
            <p className="mt-8 text-stone-300 italic text-lg max-w-2xl mx-auto leading-relaxed">
              P.S: Lembre-se, você não corre risco nenhum. Se em 14 dias você não sentir que sua energia voltou ou que seu sono melhorou, eu devolvo cada centavo. Sem perguntas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-stone-400 text-xs font-bold uppercase tracking-widest">
              <span>Pagamento 100% Seguro</span>
              <span className="hidden md:inline">•</span>
              <span>Acesso Imediato via E-mail</span>
              <span className="hidden md:inline">•</span>
              <span>Garantia de 14 Dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <footer className="py-32 px-4 bg-cream border-t border-stone-200">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Dúvidas frequentes sobre o protocolo">FAQ</SectionTitle>
          <div className="grid gap-8">
            {[
              {
                q: "Funciona para qualquer mulher?",
                a: "Sim, é adaptável a diferentes idades e perfis."
              },
              {
                q: "Preciso suspender medicamentos?",
                a: "Não, mas consulte seu médico antes de qualquer mudança."
              },
              {
                q: "Quanto tempo para ver resultados?",
                a: "Muitas mulheres notam melhorias significativas em apenas 7-14 dias."
              },
              {
                q: "O conteúdo é complexo?",
                a: "Não, o método é extremamente simples, prático e direto ao ponto."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-stone-100 shadow-sm">
                <h4 className="text-lg md:text-xl font-serif font-bold text-sage-dark mb-3 md:mb-4">{item.q}</h4>
                <p className="text-sm md:text-lg text-stone-600 leading-relaxed font-light">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-32 text-center text-stone-400 text-sm border-t border-stone-200 pt-16">
            <p className="font-bold text-sage mb-4 tracking-widest uppercase">Protocolo da Serenidade</p>
            <p>&copy; 2024. Todos os direitos reservados.</p>
            <p className="mt-4 text-xs max-w-2xl mx-auto leading-relaxed opacity-60">
              Este produto não substitui o parecer médico profissional. Sempre consulte seu médico antes de iniciar qualquer mudança na sua dieta ou estilo de vida.
            </p>
          </div>
        </div>
      </footer>
      </>
    )}
  </div>
);
}
