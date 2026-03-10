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
  ClipboardList
} from 'lucide-react';

// --- Types ---
type QuizStep = 'name' | 0 | 1 | 2 | 3 | 4 | 5 | 'analyzing' | 'diagnosis';

interface QuizState {
  step: QuizStep;
  answers: string[];
  userName: string;
}

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
  <div className="text-center mb-16 md:mb-24">
    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-[1.1] tracking-tight ${light ? 'text-white' : 'text-sage-dark'}`}>{children}</h2>
    {subtitle && <p className={`text-lg md:text-xl max-w-2xl mx-auto italic ${light ? 'text-stone-300' : 'text-stone-500'}`}>{subtitle}</p>}
    <div className={`w-20 h-1 mx-auto mt-8 rounded-full ${light ? 'bg-coral' : 'bg-sage'}`} />
  </div>
);

export default function App() {
  const [quiz, setQuiz] = useState<QuizState>({ step: 'name', answers: [], userName: '' });
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const quizQuestions = [
    {
      question: (name: string) => `${name}, qual desses sintomas mais afeta sua qualidade de vida hoje?`,
      options: ["Ondas de Calor", "Insônia e Cansaço", "Ganho de Peso e Inchaço", "Névoa Mental"],
      icon: <Zap className="text-sage" />
    },
    {
      question: (name: string) => `Você sente que seu corpo está "pegando fogo" por dentro, mesmo em ambientes frios?`,
      options: ["Sim", "Frequentemente", "Raramente"],
      icon: <Flame className="text-coral" />
    },
    {
      question: (name: string) => `Com que frequência você acorda entre 2h e 4h da manhã com a mente "ligada"?`,
      options: ["Todas as noites", "Às vezes", "Raramente"],
      icon: <Moon className="text-lavender" />
    },
    {
      question: (name: string) => `Você sabia que em Bama as mulheres não sofrem de menopausa porque ativam uma "via adrenal" escondida?`,
      options: ["Sim", "Não"],
      icon: <Brain className="text-sage-dark" />
    },
    {
      question: (name: string) => `Por que você acha que não teve sucesso em controlar os sintomas até agora?`,
      options: ["Tentei de tudo e nada funcionou", "Achei que era 'coisa da idade'", "Não queria usar hormônios sintéticos", "Nunca me explicaram a causa real"],
      icon: <Brain className="text-sage-dark" />
    },
    {
      question: (name: string) => `Está pronta para dedicar 14 dias para "reprogramar" seu sistema nervoso?`,
      options: ["Sim, estou pronta!", "Quero saber mais"],
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
      setQuiz(prev => ({
        ...prev,
        answers: [...prev.answers, answer],
        step: 'analyzing'
      }));
      startAnalysis();
    } else {
      setQuiz(prev => ({
        ...prev,
        answers: [...prev.answers, answer],
        step: nextStep as QuizStep
      }));
    }
  };

  const startAnalysis = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setAnalysisProgress(progress);
      if (progress >= 98) {
        clearInterval(interval);
        setTimeout(() => {
          setQuiz(prev => ({ ...prev, step: 'diagnosis' }));
        }, 500);
      }
    }, 40);
  };

  return (
    <div className="min-h-screen bg-cream text-stone-800 font-sans selection:bg-sage/20">
      {/* --- QUIZ HERO SECTION --- */}
      <section id="quiz" className="relative py-20 md:py-32 px-4 overflow-hidden bg-sage-dark">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920" 
            alt="Bama Village Mist" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative max-w-5xl mx-auto z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold mb-6 uppercase tracking-[0.2em]">
                O Segredo de Bama
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-[1.05] tracking-tight mb-6 text-white">
                O Segredo da Longevidade de Bama: Como mulheres de 90 anos na China <span className="text-coral italic">"enganam"</span> a menopausa.
              </h1>
              <p className="text-lg md:text-xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-light">
                Descubra o seu perfil hormonal e ative o seu <strong className="text-white font-bold">"Paradoxo do Estrogênio"</strong> em apenas 14 dias.
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {quiz.step === 'name' ? (
              <motion.div
                key="name-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-stone-900/10 border border-white"
              >
                <p className="text-stone-600 mb-10 text-lg leading-relaxed italic border-l-4 border-sage pl-6">
                  "O Padrão Bama é o nome dado ao equilíbrio hormonal perfeito encontrado em uma vila isolada na China, onde a menopausa é vivida com total serenidade. Este quiz vai comparar seus sintomas atuais com os biomarcadores de Bama para criar o seu Protocolo da Serenidade personalizado."
                </p>
                <div className="flex items-center gap-6 mb-12">
                  <div className="p-4 bg-cream rounded-2xl">
                    <Heart className="text-sage" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-sage-dark">
                    Antes de começarmos, como podemos te chamar?
                  </h3>
                </div>
                <form onSubmit={handleNameSubmit} className="space-y-8">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Seu nome aqui..."
                      value={quiz.userName}
                      onChange={(e) => setQuiz(prev => ({ ...prev, userName: e.target.value }))}
                      className="w-full p-6 text-xl border-2 border-stone-100 rounded-2xl focus:border-sage focus:ring-0 outline-none transition-all"
                    />
                  </div>
                  <Button type="submit" className="w-full py-6">
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
                className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-stone-900/10 border border-white"
              >
                <div className="flex items-center gap-6 mb-12">
                  <div className="p-4 bg-cream rounded-2xl">
                    {quizQuestions[quiz.step].icon}
                  </div>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sage transition-all duration-500" 
                      style={{ width: `${((quiz.step + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-stone-400 tracking-tighter">
                    {quiz.step + 1}/{quizQuestions.length}
                  </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-serif font-bold text-sage-dark mb-12 leading-tight">
                  {quizQuestions[quiz.step].question(quiz.userName)}
                </h3>

                <div className="grid gap-4 md:gap-5">
                  {quizQuestions[quiz.step].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-5 md:p-6 text-left rounded-2xl border border-stone-200 hover:border-sage hover:bg-sage/5 hover:shadow-md transition-all duration-300 group flex items-center justify-between"
                    >
                      <span className="text-lg font-medium text-stone-700 group-hover:text-sage-dark">{option}</span>
                      <div className="w-7 h-7 rounded-full border-2 border-stone-200 group-hover:border-sage group-hover:bg-sage flex items-center justify-center transition-colors">
                        <CheckCircle2 size={16} className="text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : quiz.step === 'analyzing' ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="relative w-56 h-56 mx-auto mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="104"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-stone-100"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="104"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={653}
                      strokeDashoffset={653 - (653 * analysisProgress) / 100}
                      className="text-sage transition-all duration-100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-5xl font-bold text-sage-dark">{analysisProgress}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-serif font-bold text-sage-dark mb-4">Analisando seu Perfil Hormonal...</h3>
                <p className="text-stone-500 italic text-lg">Processando suas respostas com o Código de Bama, {quiz.userName}.</p>
              </motion.div>
            ) : (
              <motion.div
                key="diagnosis"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-sage-dark text-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-stone-900/20 border border-white/10"
              >
                <div className="flex items-center gap-3 text-coral font-bold tracking-[0.2em] mb-6 uppercase text-sm">
                  <Zap size={20} /> DIAGNÓSTICO PERSONALIZADO CONCLUÍDO
                </div>
                
                <h3 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                  {quiz.userName}, seu Sistema Hormonal está em <span className="text-coral italic">"Modo de Sobrevivência"</span>.
                </h3>

                <div className="space-y-6 text-xl text-stone-300 leading-relaxed font-light mb-10">
                  <p>
                    {quiz.userName}, não é sua culpa que você não teve sucesso até agora. Você estava tentando consertar os ovários quando deveria estar ligando o seu <strong>gerador de reserva (as adrenais)</strong>.
                  </p>
                  
                  <p>
                    Com base nas suas respostas, identificamos que seu <strong>hipotálamo</strong> — o centro de comando do seu corpo — está enviando sinais de pânico constantes devido ao <strong>Relógio Biológico Silencioso</strong>.
                  </p>
                  
                  <div className="bg-white/5 border-l-4 border-coral p-6 rounded-r-2xl my-8">
                    <p className="text-white font-medium mb-2">Análise de Sintomas para {quiz.userName}:</p>
                    <ul className="space-y-3 text-lg">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-coral mt-1 flex-shrink-0" />
                        <span>Sua queixa principal de <strong>{quiz.answers[0]}</strong> é um sinal claro de que seu "termostato interno" perdeu a calibração devido à <strong>Indústria da Desinformação Hormonal</strong>.</span>
                      </li>
                      {quiz.answers[1] === "Sim" || quiz.answers[1] === "Frequentemente" ? (
                        <li className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-coral mt-1 flex-shrink-0" />
                          <span>A sensação de "fogo interno" confirma que seu corpo está tentando dissipar calor de forma desordenada.</span>
                        </li>
                      ) : null}
                      {quiz.answers[2] === "Todas as noites" || quiz.answers[2] === "Às vezes" ? (
                        <li className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-coral mt-1 flex-shrink-0" />
                          <span>O despertar entre 2h e 4h indica que suas adrenais estão sobrecarregadas, disparando cortisol no momento errado.</span>
                        </li>
                      ) : null}
                    </ul>
                  </div>


                  
                  <p className="text-white font-bold">
                    A única forma de recuperar sua vitalidade na menopausa é ativando a Via Adrenal, e o Protocolo da Serenidade é o único caminho para fazer isso sem hormônios sintéticos.
                  </p>
                </div>

                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 mb-12 text-center">
                  <p className="text-xl italic text-stone-300 leading-relaxed">
                    "{quiz.userName}, você está a apenas 14 dias de resetar esse sistema e recuperar a energia de uma mulher de 30 anos."
                  </p>
                </div>

                <Button 
                  variant="secondary" 
                  className="w-full py-7 text-xl"
                  onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Quero Iniciar meu Reset Agora <ArrowRight size={24} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>

    {quiz.step === 'diagnosis' && (
      <>
        {/* --- STORY SECTION --- */}
        <section id="story" className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-900/10">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000" 
                  alt="Vila de Bama" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 md:-right-8 bg-lavender/95 backdrop-blur-md text-white p-8 md:p-10 rounded-[2rem] shadow-xl max-w-xs border border-white/20">
                <p className="font-serif italic text-xl leading-relaxed">
                  "Lá, as mulheres não lutam contra o tempo; elas colaboram com ele."
                </p>
              </div>
            </div>
            <div>
              <span className="text-sage font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6 block">O Segredo de Bama</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-sage-dark mb-10 leading-[1.1] tracking-tight">
                Por que em Bama a Menopausa <span className="italic text-coral">"Não Existe"</span>?
              </h2>
              <div className="space-y-8 text-xl text-stone-600 leading-relaxed font-light">
                <p>
                  Nas montanhas isoladas de Guangxi, na China, a Vila de Bama esconde um segredo milenar. Lá, as mulheres não lutam contra o tempo; elas colaboram com ele. Elas não usam reposição hormonal química. Em vez disso, elas utilizam o <strong>Paradoxo do Estrogênio</strong>.
                </p>
                <p>
                  Elas consomem nutrientes específicos que "enganam" o cérebro, enviando sinais de que o corpo ainda está em equilíbrio. Elas ativam as <strong>Glândulas Adrenais</strong> para assumir o papel que antes era dos ovários.
                </p>
                <p className="font-bold text-sage-dark text-2xl">
                  O resultado? Centenárias com pele radiante, sono de pedra e zero fogachos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNIQUES SECTION --- */}
      <section className="py-32 px-4 bg-sage-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle light subtitle="Como o Protocolo da Serenidade vai transformar você em 14 dias">
            As Técnicas do Protocolo
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Método R.E.S.E.T. Hormonal",
                desc: "Aprenda técnicas práticas para aliviar o desconforto de calorões rapidamente, ajudando você a se sentir mais confortável e equilibrada.",
                icon: <Zap className="text-sage" />,
                tag: "Alívio Rápido"
              },
              {
                title: "Os 7 Gatilhos Ocultos",
                desc: "Identifique fatores que intensificam seus sintomas (o gatilho 4 vai te surpreender) e aprenda como neutralizá-los.",
                icon: <Brain className="text-lavender" />,
                tag: "Diagnóstico"
              },
              {
                title: "Técnica do Interruptor Térmico",
                desc: "Quando o calor começar, você saberá exatamente o que fazer para se sentir fresca e no controle instantaneamente.",
                icon: <Flame className="text-coral" />,
                tag: "Controle Térmico"
              },
              {
                title: "Ritual Noturno de 12 Minutos",
                desc: "Feche os olhos e deslize para um sono profundo, acordando renovada – mesmo que a insônia tenha sido sua companheira por anos.",
                icon: <Moon className="text-indigo-400" />,
                tag: "Sono Profundo"
              },
              {
                title: "O Paradoxo do Estrogênio",
                desc: "Como apoiar seu corpo naturalmente para encontrar mais equilíbrio hormonal sem depender de substâncias sintéticas.",
                icon: <Scale className="text-sage" />,
                tag: "Equilíbrio"
              },
              {
                title: "Plano Alimentar da Serenidade",
                desc: "Cardápio de 14 dias desenhado especificamente para apoiar seu equilíbrio hormonal e nutrir suas glândulas adrenais.",
                icon: <Clock className="text-white" />,
                tag: "Nutrição"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-[2rem] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 bg-white/5 px-3 py-1 rounded-full">{item.tag}</span>
                </div>
                <h4 className="text-2xl font-serif font-bold mb-4">{item.title}</h4>
                <p className="text-stone-300 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="A Vida Após o Reset de 14 Dias">
            Histórias de Transformação
          </SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "As ondas de calor quase sumiram!",
                text: "Eu não aguentava mais trocar de roupa três vezes por noite. O Protocolo me mostrou que o segredo estava em 'enganar' meu hipotálamo com ajustes simples no prato. Hoje, as ondas de calor quase sumiram. Agora consigo aproveitar meus dias!",
                author: "Cláudia, 54 anos, São Paulo"
              },
              {
                title: "Meu marido notou a diferença!",
                text: "Eu vivia em uma 'névoa mental' e não dormia nada. O Ritual Noturno [estabilização da glicose] me devolveu o sono de forma impressionante. Acordo descansada e com paciência. Meu marido notou a diferença logo na primeira semana!",
                author: "Patrícia, 49 anos, Belo Horizonte"
              },
              {
                title: "Até meu médico aprovou!",
                text: "Eu estava cética, mas decidi tentar o plano de 14 dias antes de partir para medicamentos pesados. Meu médico ficou impressionado com minha energia nos exames de rotina. Ele aprovou o Protocolo e disse para eu continuar exatamente o que estou fazendo!",
                author: "Sandra, 57 anos, Rio de Janeiro"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-cream/30 p-10 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} size={16} className="fill-coral text-coral" />
                  ))}
                </div>
                <h4 className="text-xl font-serif font-bold text-sage-dark mb-4">"{item.title}"</h4>
                <p className="text-stone-600 leading-relaxed mb-8 font-light italic">"{item.text}"</p>
                <div className="pt-6 border-t border-stone-100">
                  <p className="font-bold text-sage-dark text-sm uppercase tracking-wider">— {item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OFFER SECTION --- */}
      <section className="py-32 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-stone-100">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-10 md:p-20 bg-sage text-white">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12">O que você recebe hoje:</h2>
                <div className="space-y-10">
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Guia Master: O Paradoxo do Estrogênio</h4>
                      <p className="text-sage-dark/80 font-medium">Manual completo de reprogramação hormonal.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">O Cronograma de Bama</h4>
                      <p className="text-sage-dark/80 font-medium">Plano alimentar de 14 dias (Café, Almoço e Jantar detalhados).</p>
                    </div>
                  </div>
                  
                  <div className="pt-10 border-t border-white/20">
                    <h5 className="text-xs font-bold tracking-[0.3em] uppercase mb-8 text-white/60">Bônus Exclusivos</h5>
                    <div className="grid gap-8">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center font-bold">✓</div>
                        <p className="text-lg font-medium">O Protocolo de 28 Dias para Recuperar a Elasticidade e o Desejo</p>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center font-bold">✓</div>
                        <p className="text-lg font-medium">Diário da Menopausa — planilha para acompanhar seu progresso</p>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center font-bold">✓</div>
                        <p className="text-lg font-medium">Livro de Receitas Hormonais — refeições práticas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 p-10 md:p-16 flex flex-col justify-center items-center text-center bg-gradient-to-b from-stone-50 to-stone-100/50">
                <div className="mb-10">
                  <span className="inline-block px-4 py-1.5 bg-coral/10 text-coral font-bold rounded-full text-sm tracking-widest uppercase mb-6">
                    Oferta Especial de Lançamento
                  </span>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-stone-400 line-through text-2xl font-medium">R$ 97,00</span>
                    <div className="text-7xl md:text-8xl font-bold text-sage-dark mt-2 tracking-tight">
                      R$ 27<span className="text-4xl md:text-5xl text-sage">,90</span>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="secondary" className="w-full py-8 text-xl shadow-coral/30">
                    Quero Meu Acesso Agora <ShoppingBag size={24} />
                  </Button>
                </a>

                <p className="mt-8 text-stone-500 italic text-sm max-w-md mx-auto leading-relaxed">
                  Se você está lendo isso, seu hipotálamo já enviou um sinal de alerta hoje. Você pode ignorar e enfrentar outra noite em claro, ou pode começar o Dia 1 amanhã mesmo. A decisão de Bama está em suas mãos.
                </p>
                
                <div className="mt-12 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3 text-stone-400">
                    <ShieldCheck size={24} />
                    <span className="text-sm font-medium">Pagamento 100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-6 opacity-40 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" referrerPolicy="no-referrer" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" referrerPolicy="no-referrer" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- GUARANTEE --- */}
          <div className="mt-20 max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-stone-100 flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 flex-shrink-0">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1000/1000951.png" 
                alt="Garantia" 
                className="w-full h-full object-contain opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-sage-dark mb-4">Garantia de 30 Dias "Serenidade Total"</h3>
              <p className="text-lg text-stone-600 leading-relaxed font-light">
                Siga o plano por 14 dias. Se você não sentir sua pele mais firme, seus calorões desaparecendo e seu sono voltando ao normal, eu devolvo 100% do seu dinheiro. Sem perguntas.
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
          <div className="bg-cream/50 p-10 md:p-16 rounded-[3rem] border border-stone-100">
            <p className="text-xl text-stone-700 font-medium mb-8 italic">
              "Nós entendemos a frustração de se sentir uma estranha no próprio corpo. Por isso, decodificamos o método que mantém as mulheres de Bama vibrantes há gerações."
            </p>
            <p className="text-xl text-stone-600 leading-relaxed font-light italic">
              O Protocolo da Serenidade não nasceu em laboratórios farmacêuticos, mas sim de uma busca incessante por respostas que a medicina convencional muitas vezes ignora. Somos um coletivo de pesquisadores independentes, nutricionistas e especialistas em saúde integrativa, apaixonados pela biologia da longevidade.
            </p>
            <p className="text-xl text-stone-600 leading-relaxed font-light italic mt-8">
              Nossa equipe dedicou anos estudando o 'Paradoxo do Estrogênio' e as zonas azuis do mundo — como a Vila de Bama — para traduzir segredos ancestrais em um método prático de 14 dias. Nosso objetivo é claro: dar a cada mulher o mapa para que ela não seja refém dos seus hormônios, mas sim a mestre do seu próprio bem-estar.
            </p>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-24 px-4 bg-sage-dark text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Você está a 14 dias de uma nova versão de si mesma.</h2>
          <p className="text-xl text-stone-300 mb-12 font-light leading-relaxed">
            Junte-se a Cláudia, Patrícia, Sandra e centenas de outras mulheres que decidiram não aceitar o desconforto como parte do envelhecimento. O Segredo de Bama e o Paradoxo do Estrogênio estão agora ao seu alcance.
          </p>
          <a 
            href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="secondary" className="py-8 px-12 text-xl shadow-coral/40">
              👉 QUERO COMEÇAR MEU PROTOCOLO DE 14 DIAS AGORA
            </Button>
          </a>
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
              <div key={idx} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                <h4 className="text-xl font-serif font-bold text-sage-dark mb-4">{item.q}</h4>
                <p className="text-stone-600 leading-relaxed text-lg font-light">{item.a}</p>
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
