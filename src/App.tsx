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

const CountdownTimer = ({ show }: { show: boolean }) => {
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
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-[150] bg-amber-50 text-amber-900 py-2 md:py-3 px-2 md:px-4 shadow-sm border-b border-amber-100 flex items-center justify-center gap-2 md:gap-6"
        >
          <div className="flex items-center gap-1 md:gap-2">
            <Zap size={16} className="text-amber-600 animate-pulse hidden sm:block md:w-6 md:h-6" />
            <span className="text-[14px] sm:text-base md:text-2xl font-black uppercase tracking-tight sm:tracking-wider md:tracking-[0.2em]">⏱️ Oportunidade Única: O seu diagnóstico personalizado expira em:</span>
          </div>
          <div className="flex items-center gap-1 md:gap-3 font-mono font-bold text-base md:text-3xl bg-amber-100 px-3 md:px-4 py-2 md:py-2 rounded-lg md:rounded-xl shrink-0">
            <Clock size={20} className="text-amber-600 animate-pulse md:w-6 md:h-6" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NotificationPopup = ({ show }: { show: boolean }) => {
  const notifications = [
    "🛒 Maria acabou de adquirir o Protocolo da Serenidade (Ribeirão Preto/SP)",
    "🛒 Tereza acaba de garantir o acesso com desconto (Juiz de Fora/MG)",
    "🔥 Mais de 1.247 mulheres já iniciaram o Reset de 14 dias este mês.",
    "📢 Apenas 4 vagas restantes com o valor promocional de R$ 27,90.",
    "🛒 Fátima acabou de adquirir o Protocolo da Serenidade (Londrina/PR)",
    "🛒 Regina acaba de garantir o acesso com desconto (Caxias do Sul/RS)",
    "🛒 Sônia acabou de adquirir o Protocolo da Serenidade (Feira de Santana/BA)",
    "🛒 Cláudia acaba de garantir o acesso com desconto (Campina Grande/PB)",
    "🛒 Beatriz acabou de adquirir o Protocolo da Serenidade (Anápolis/GO)",
    "🛒 Helena acaba de garantir o acesso com desconto (Petrolina/PE)",
    "🛒 Márcia acabou de adquirir o Protocolo da Serenidade (Dourados/MS)",
    "🛒 Ivone acaba de garantir o acesso com desconto (Sorocaba/SP)",
    "🛒 Patrícia acabou de adquirir o Protocolo da Serenidade (Piracicaba/SP)",
    "🛒 Sandra acaba de garantir o acesso com desconto (Joinville/SC)",
    "🛒 Luciana acabou de adquirir o Protocolo da Serenidade (Uberlândia/MG)",
    "🛒 Adriana acaba de garantir o acesso com desconto (Cascavel/PR)",
    "🛒 Mônica acabou de adquirir o Protocolo da Serenidade (Caruaru/PE)",
    "🛒 Fernanda acaba de garantir o acesso com desconto (Sobral/CE)",
    "🛒 Silvana acaba de garantir o acesso com desconto (Imperatriz/MA)",
    "🛒 Rosana acabou de adquirir o Protocolo da Serenidade (Marabá/PA)",
    "🛒 Eliane acaba de garantir o acesso com desconto (Rondonópolis/MT)",
    "🛒 Vera acaba de garantir o acesso com desconto (Ji-Paraná/RO)",
    "🛒 Marta acaba de garantir o acesso com desconto (Passo Fundo/RS)",
    "🛒 Neusa acabou de adquirir o Protocolo da Serenidade (Santa Maria/RS)",
    "🛒 Zélia acaba de garantir o acesso com desconto (Pelotas/RS)",
    "🛒 Ângela acabou de adquirir o Protocolo da Serenidade (Blumenau/SC)",
    "🛒 Marli acaba de garantir o acesso com desconto (Chapecó/SC)",
    "🛒 Inês acaba de garantir o acesso com desconto (Itajaí/SC)",
    "🛒 Dirce acaba de garantir o acesso com desconto (Criciúma/SC)",
    "🛒 Cleusa acaba de garantir o acesso com desconto (Ponta Grossa/PR)",
    "🛒 Alzira acaba de garantir o acesso com desconto (Maringá/PR)",
    "🛒 Nair acaba de adquirir o Protocolo da Serenidade (Foz do Iguaçu/PR)",
    "🛒 Hilda acaba de garantir o acesso com desconto (Guarapuava/PR)",
    "🛒 Odete acabou de adquirir o Protocolo da Serenidade (Bauru/SP)",
    "🛒 Arlete acaba de garantir o acesso com desconto (São José do Rio Preto/SP)",
    "🛒 Wilma acabou de adquirir o Protocolo da Serenidade (Presidente Prudente/SP)",
    "🛒 Gilda acaba de garantir o acesso com desconto (Araçatuba/SP)",
    "🛒 Dalva acabou de adquirir o Protocolo da Serenidade (Franca/SP)",
    "🛒 Zilda acaba de garantir o acesso com desconto (Araraquara/SP)",
    "🛒 Selma acabou de adquirir o Protocolo da Serenidade (São Carlos/SP)",
    "🛒 Telma acaba de garantir o acesso com desconto (Limeira/SP)",
    "🛒 Vilma acabou de adquirir o Protocolo da Serenidade (Americana/SP)",
    "🛒 Edna acaba de garantir o acesso com desconto (Indaiatuba/SP)",
    "🛒 Olga acabou de adquirir o Protocolo da Serenidade (Itu/SP)",
    "🛒 Ruth acaba de garantir o acesso com desconto (Taubaté/SP)",
    "🛒 Ester acabou de adquirir o Protocolo da Serenidade (São José dos Campos/SP)",
    "🛒 Noemi acaba de garantir o acesso com desconto (Jacareí/SP)",
    "🛒 Sara acabou de adquirir o Protocolo da Serenidade (Pindamonhangaba/SP)",
    "🛒 Raquel acaba de garantir o acesso com desconto (Guaratinguetá/SP)",
    "🛒 Débora acabou de adquirir o Protocolo da Serenidade (Lorena/SP)",
    "🛒 Miriam acaba de garantir o acesso com desconto (Cruzeiro/SP)",
    "🛒 Rebeca acabou de adquirir o Protocolo da Serenidade (Resende/RJ)",
    "🛒 Abigail acaba de garantir o acesso com desconto (Volta Redonda/RJ)",
    "🛒 Eunice acabou de adquirir o Protocolo da Serenidade (Barra Mansa/RJ)",
    "🛒 Lídia acaba de garantir o acesso com desconto (Angra dos Reis/RJ)",
    "🛒 Priscila acabou de adquirir o Protocolo da Serenidade (Cabo Frio/RJ)",
    "🛒 Marta acaba de garantir o acesso com desconto (Macaé/RJ)",
    "🛒 Dorcas acabou de adquirir o Protocolo da Serenidade (Campos dos Goytacazes/RJ)",
    "🛒 Tabita acaba de garantir o acesso com desconto (Nova Friburgo/RJ)",
    "🛒 Débora acabou de adquirir o Protocolo da Serenidade (Petrópolis/RJ)",
    "🛒 Noemi acaba de garantir o acesso com desconto (Teresópolis/RJ)",
    "🛒 Lúcia acabou de adquirir o Protocolo da Serenidade (Sobral/CE)",
    "🛒 Cláudia acaba de garantir o acesso com desconto (Mossoró/RN)",
    "🛒 Antônia acabou de adquirir o Protocolo da Serenidade (Juazeiro do Norte/CE)",
    "🛒 Francisca acaba de garantir o acesso com desconto (Crato/CE)",
    "🛒 Maria acaba de adquirir o Protocolo da Serenidade (Parnaíba/PI)",
    "🛒 Josefa acaba de garantir o acesso com desconto (Arapiraca/AL)",
    "🛒 Raimunda acabou de adquirir o Protocolo da Serenidade (Vitória da Conquista/BA)",
    "🛒 Sebastiana acaba de garantir o acesso com desconto (Itabuna/BA)",
    "🛒 Luzia acabou de adquirir o Protocolo da Serenidade (Ilhéus/BA)",
    "🛒 Terezinha acaba de garantir o acesso com desconto (Jequié/BA)"
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    // Initial delay of 5 seconds
    const initialTimeout = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, [show]);

  useEffect(() => {
    if (!visible || !show) return;

    // Show for 5 seconds, then hide for 10 seconds, then show next
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

const ProductMockup = ({ compact = false }: { compact?: boolean }) => (
  <div className={`relative w-full mx-auto ${compact ? 'py-2 md:py-8' : 'py-12 md:py-20'} px-4 overflow-visible`}>
    <div className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 ${compact ? 'max-w-md md:max-w-4xl mx-auto' : ''}`}>
      {/* Tablet Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative w-full ${compact ? 'max-w-[240px] md:max-w-[400px]' : 'max-w-[320px] md:max-w-[450px]'} aspect-[3/4] bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] md:border-[12px] border-stone-800 z-20`}
      >
        <div className="absolute inset-0 bg-[#79b4b7] flex flex-col items-center justify-between p-6 md:p-10 text-center">
          <div className="w-full pt-4 md:pt-8">
            <p className="text-white/80 text-base md:text-xl font-bold uppercase tracking-[0.2em] mb-2 md:mb-4">O Método de Bama</p>
            <h3 className="text-xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-2 md:mb-4">O PROTOCOLO DA SERENIDADE</h3>
            <div className="w-10 md:w-16 h-1 bg-amber-400 mx-auto rounded-full" />
          </div>
          
          <div className="w-32 h-32 md:w-64 md:h-64 rounded-full overflow-hidden border-2 md:border-4 border-white/20 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500" 
              alt="Mulher Serena" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="w-full pb-4 md:pb-8">
            <p className="text-white text-lg md:text-2xl font-medium mb-2 md:mb-4 italic">Silencie a Menopausa em 14 Dias</p>
            <p className="text-white/60 text-sm md:text-lg font-bold uppercase tracking-widest border-t border-white/10 pt-2 md:pt-4 leading-tight">Guia Prático de Reset Hormonal</p>
          </div>
        </div>
      </motion.div>

      {/* Smartphone Mockup */}
      <motion.div 
        initial={{ opacity: 0, x: 30, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        className={`relative ${compact ? 'w-[120px] md:w-[260px]' : 'w-[160px] md:w-[280px]'} aspect-[9/19] bg-stone-900 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-[4px] md:border-[10px] border-stone-800 -mt-12 md:mt-24 md:-ml-16 z-30`}
      >
        <div className="absolute inset-0 bg-white flex flex-col">
          <div className="h-3 md:h-8 bg-stone-900 w-1/3 mx-auto rounded-b-xl mb-2 md:mb-6" />
          <div className="p-4 md:p-8 flex-1 overflow-hidden">
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-sage/10 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-sage md:w-6 md:h-6" />
              </div>
              <span className="text-sm md:text-lg font-bold text-stone-400 uppercase tracking-widest">Plano 14 Dias</span>
            </div>
            <h4 className="text-lg md:text-2xl font-serif font-bold text-sage-dark mb-4 md:mb-8 leading-tight">Cardápio Anti-Inflamatório</h4>
            <div className="space-y-3 md:space-y-6">
              {[
                { label: "Café", img: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&q=80&w=200" },
                { label: "Almoço", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200" },
                { label: "Jantar", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=200" }
              ].map((meal, i) => (
                <div key={i} className="bg-stone-50 rounded-lg md:rounded-2xl p-2 md:p-4 flex items-center gap-3 md:gap-6 border border-stone-100">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden shrink-0">
                    <img src={meal.img} alt={meal.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-lg md:text-xl font-medium text-stone-600">{meal.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    
    {/* Decorative Elements */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] md:w-[140%] md:h-[140%] bg-sage/5 rounded-full blur-[100px] -z-10" />
  </div>
);

const SectionTitle = ({ children, subtitle, light = false }: { children: React.ReactNode; subtitle?: string; light?: boolean }) => (
  <div className="text-center mb-12 md:mb-20 px-4">
    <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6 leading-[1.1] tracking-tight ${light ? 'text-white' : 'text-sage-dark'}`}>{children}</h2>
    {subtitle && <p className={`text-base sm:text-lg md:text-xl max-w-4xl mx-auto italic ${light ? 'text-stone-300' : 'text-stone-500'}`}>{subtitle}</p>}
    <div className={`w-12 md:w-20 h-1 md:h-1.5 mx-auto mt-4 md:mt-8 rounded-full ${light ? 'bg-coral' : 'bg-sage'}`} />
  </div>
);

export default function App() {
  const [quiz, setQuiz] = useState<QuizState>({ step: 'name', answers: [], userName: '' });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiDiagnosis, setAiDiagnosis] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  // Scroll to top ONLY on diagnosis step
  useEffect(() => {
    if (quiz.step === 'diagnosis') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [quiz.step]);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button after scrolling 600px (roughly past the first fold/mockup)
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      icon: <Flame className="text-coral-text" />
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
      <CountdownTimer show={quiz.step === 'diagnosis'} />
      <NotificationPopup show={quiz.step === 'diagnosis'} />
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
        
        <div className="relative max-w-7xl mx-auto z-10">
          {quiz.step !== 'diagnosis' && (
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-lg font-bold mb-8 uppercase tracking-[0.2em]">
                  O Segredo de Bama
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight mb-8 text-white">
                  O Segredo de Bama: Como mulheres de 90 anos na China silenciaram os sintomas da menopausa <span className="text-coral-text italic">(sem usar um único hormônio sintético)</span>.
                </h1>
                <p className="text-lg md:text-2xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-light px-4">
                  Descubra seu perfil hormonal e ative seu <strong>'Paradoxo do Estrogênio'</strong> para resetar seu metabolismo e seu sono em apenas 14 dias.
                </p>
              </motion.div>
            </div>
          )}

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

                <h3 className="text-xl md:text-3xl font-serif font-bold text-sage-dark mb-8 md:mb-10 leading-tight">
                  {quizQuestions[quiz.step].question(quiz.userName)}
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
                <p className="text-stone-500 italic text-xl md:text-3xl">Processando suas respostas com o Código de Bama, {quiz.userName}.</p>
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
                className="bg-sage-dark text-white rounded-[2.5rem] p-6 md:p-16 shadow-2xl shadow-stone-900/20 border border-white/10"
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col items-center gap-4 text-white/80 font-bold tracking-[0.2em] mb-10 uppercase text-lg md:text-xl justify-center text-center"
                >
                  <div className="flex items-center gap-4">
                    <Zap size={32} className="text-coral-text" /> DIAGNÓSTICO PERSONALIZADO LIBERADO COM SUCESSO
                  </div>
                  <div className="w-full max-w-md bg-white/10 h-3 rounded-full overflow-hidden mt-6 relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-coral shadow-[0_0_15px_rgba(255,107,107,0.5)]"
                    />
                  </div>
                  <p className="text-sm md:text-lg italic font-serif normal-case tracking-normal mt-4 text-white/60">
                    "Sua jornada para endireitar sua saúde começa agora."
                  </p>
                </motion.div>

                {aiDiagnosis && (
                  <div className="flex justify-center mb-10">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-coral/20 text-coral-text px-6 py-2 rounded-full text-sm md:text-base font-bold inline-block"
                    >
                      {aiDiagnosis.split('\n')[0]}
                    </motion.div>
                  </div>
                )}
                
                <motion.div className="text-center mb-14 md:mb-20">
                  <motion.h3 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight text-white"
                  >
                    A Revelação do que Estava Oculto: O "Interruptor Térmico" que Silencia a Menopausa em 14 Dias.
                  </motion.h3>
                  <motion.p 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-4xl mx-auto"
                  >
                    "Eu abrirei portas que ninguém pode fechar..." Descubra por que seu corpo entrou no "Modo de Sobrevivência" e como o Segredo de Bama é a chave para recuperar o sono e a paz que você merece.
                  </motion.p>
                </motion.div>

                {aiDiagnosis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-serif italic text-coral-text mb-14 md:mb-20 text-center leading-tight px-4"
                  >
                    {aiDiagnosis.split('\n')[1]}
                  </motion.div>
                )}

                <div className="space-y-10 md:space-y-14 mb-14 md:mb-20">
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 p-6 md:p-14 rounded-[3rem] shadow-xl backdrop-blur-sm"
                  >
                    <div className="text-xl md:text-2xl text-stone-200 leading-relaxed font-light space-y-8 text-center">
                      <p className="text-coral-text font-bold uppercase tracking-widest text-lg md:text-xl mb-8">Por que os caminhos da sua saúde parecem "travados"?</p>
                      <p>
                        {quiz.userName}, o seu diagnóstico confirmou: você não está doente, você está apenas com a raiz hormonal fora do lugar.
                      </p>
                      <p>
                        Assim como uma árvore não dá frutos se a raiz estiver sufocada, seu corpo não consegue queimar gordura ou esfriar os calorões se o seu Hipotálamo estiver travado no modo de pânico.
                      </p>
                      <p>
                        ⚠️ <strong>A Implicação Real:</strong> Você passou anos tratando os "galhos" (os sintomas), mas hoje a verdade foi revelada: seu corpo foi "sequestrado" pelo estresse moderno. É hora de endireitar o que o tempo entortou.
                      </p>
                      <div className="w-16 h-1 bg-white/20 mx-auto my-8" />
                      {aiDiagnosis ? (
                        <div className="space-y-8">
                          {aiDiagnosis.split('\n').slice(2).map((line, i) => (
                            <p key={i} className="text-white text-2xl md:text-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-coral-text">$1</strong>') }} />
                          ))}
                        </div>
                      ) : (
                        <>
                          <p>⚠️ {quiz.userName}, o seu diagnóstico confirmou: você não está doente, você está apenas com a raiz hormonal fora do lugar.</p>
                        </>
                      )}
                    </div>
                  </motion.div>

                  <ProductMockup compact />

                  {/* [BOTÃO DE AÇÃO IMEDIATA (ACIMA DA DOBRA)] */}
                  <div className="space-y-6 mb-14">
                    <p className="text-center text-white font-bold text-xl md:text-2xl px-4 italic">
                      "Não tome uma decisão precipitada. Reflita: como você quer estar daqui a 14 dias?"
                    </p>
                    <a 
                      href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button 
                        variant="secondary" 
                        className="w-full py-6 md:py-8 text-xl md:text-2xl shadow-coral-text/40 bg-coral hover:bg-coral-dark animate-pulse"
                      >
                        👉 SIM! QUERO MINHA DIREÇÃO E MEU RESET DE 14 DIAS
                      </Button>
                    </a>
                    <p className="text-center text-white font-bold text-lg md:text-2xl px-4">
                      Investimento simbólico: <span className="text-coral-text">R$ 27,90</span>
                    </p>
                  </div>

                  {/* [BLOCO DE ALÍVIO RÁPIDO - NOVO!] */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="bg-coral/10 border border-coral/20 p-8 md:p-14 rounded-[3rem] shadow-xl"
                  >
                    <h4 className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 text-center">O que você precisa agora não é de dieta, é de um RESET.</h4>
                    <div className="grid gap-6">
                      <div className="flex items-center gap-6 text-stone-200 justify-center md:justify-center">
                        <div className="w-10 h-10 bg-coral/20 rounded-full flex items-center justify-center text-coral-text shrink-0 font-bold">✓</div>
                        <p className="text-xl md:text-2xl text-center"><strong>Método 100% Natural</strong></p>
                      </div>
                      <div className="flex items-center gap-6 text-stone-200 justify-center md:justify-center">
                        <div className="w-10 h-10 bg-coral/20 rounded-full flex items-center justify-center text-coral-text shrink-0 font-bold">✓</div>
                        <p className="text-xl md:text-2xl text-center"><strong>Apenas 12 minutos por dia</strong></p>
                      </div>
                      <div className="flex items-center gap-6 text-stone-200 justify-center md:justify-center">
                        <div className="w-10 h-10 bg-coral/20 rounded-full flex items-center justify-center text-coral-text shrink-0 font-bold">✓</div>
                        <p className="text-xl md:text-2xl text-center"><strong>Alívio sentido na primeira semana</strong></p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <p className="mt-8 text-center text-stone-400 text-lg md:text-xl font-bold uppercase tracking-widest">
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
        <div className="max-w-7xl mx-auto">
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
              <div className="absolute -bottom-10 -right-6 md:-right-12 bg-sage/95 backdrop-blur-md text-white p-10 md:p-12 rounded-[3rem] shadow-2xl max-w-sm border border-white/20">
                <p className="font-serif italic text-2xl md:text-3xl leading-relaxed">
                  "O Segredo Protege a Bênção"
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-sage-dark mb-8 md:mb-12 leading-[1.1] tracking-tight text-center">
                O que é o Padrão Bama?
              </h2>
              <div className="space-y-6 md:space-y-10 text-lg md:text-2xl text-stone-600 leading-relaxed font-light px-4 md:px-0 text-center">
                <p>
                  Existe um lugar onde mulheres de 70 anos têm a vitalidade de 30. Elas não conhecem calorões e não sofrem com insônia. O segredo delas não está em remédios, mas em como elas sinalizam "Paz" para o cérebro através da Via Adrenal.
                </p>
                <p>
                  O Protocolo da Serenidade é o método de 12 minutos que recalibra o seu <strong>"Interruptor Térmico"</strong>, ensinando seu corpo que o tempo de sofrer acabou.
                </p>
                <div className="pt-8">
                  <p className="text-stone-500 italic">
                    Não conte para as pessoas negativas que você encontrou este caminho. Deixe que elas vejam apenas o seu brilho voltando, sua paz restaurada e seu corpo transformado. O seu resultado será a sua maior resposta.
                  </p>
                </div>
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
        
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionTitle light subtitle="O que vai acontecer com você nas próximas 2 semanas:">
            O Seu Plano de Transformação
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "FASE 1: O Reset Térmico",
                desc: "Você aplicará o ritual para neutralizar os calorões instantaneamente e sentirá a primeira noite de sono profundo.",
                icon: <Flame className="text-coral-text" />,
                tag: "Dias 1-7"
              },
              {
                title: "FASE 2: A Blindagem de Bama",
                desc: "Você aprenderá as combinações de alimentos que mantêm sua temperatura estável e destravam seu metabolismo.",
                icon: <Scale className="text-sage" />,
                tag: "Dias 8-14"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-14 rounded-[3rem] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 md:mb-10 gap-4 md:gap-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0">
                    {React.cloneElement(item.icon as React.ReactElement, { size: 48 })}
                  </div>
                  <span className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-white/50 bg-white/5 px-4 py-2 rounded-full mx-auto md:mx-0">{item.tag}</span>
                </div>
                <h4 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6 text-center">{item.title}</h4>
                <p className="text-lg md:text-xl text-stone-300 leading-relaxed font-light text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION (BLOCK 4 - PART 1) --- */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="A Vida Após o Reset de 14 Dias:">
            Vidas que se "Endireitaram"
          </SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Minha vida se endireitou!",
                text: "Eu vivia encurvada pelo cansaço e pelas dores que ninguém resolvia. Parecia que meu corpo estava sempre pegando fogo. Com o Protocolo, em 14 dias, senti uma paz que não tinha há anos.",
                author: "Cláudia, 54 anos"
              },
              {
                title: "A raiz foi tratada!",
                text: "Eu tentava de tudo, mas nada funcionava porque eu só tratava o 'galho'. Quando entendi o segredo do Hipotálamo, tudo mudou. Voltei a dormir como uma pedra.",
                author: "Patrícia, 49 anos"
              },
              {
                title: "Decidi com paz.",
                text: "Estava desconfiada, mas senti paz ao ler sobre o método. Foi a melhor direção que tomei. Hoje me sinto renovada e com disposição para cuidar da minha família.",
                author: "Sandra, 57 anos"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-cream/30 p-10 md:p-14 rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow relative text-center">
                <div className="flex justify-center gap-2 mb-6 md:mb-10">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} size={24} className="fill-coral-accent text-coral-accent" />
                  ))}
                </div>
                <h4 className="text-2xl md:text-3xl font-serif font-bold text-sage-dark mb-6 md:mb-8">"{item.title}"</h4>
                <p className="text-xl md:text-2xl text-stone-600 leading-relaxed mb-8 md:mb-12 font-light italic" dangerouslySetInnerHTML={{ __html: `"${item.text}"` }} />
                <div className="pt-6 md:pt-10 border-t border-stone-100">
                  <p className="font-bold text-sage-dark text-lg md:text-xl uppercase tracking-wider">— {item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OFFER SECTION (BLOCK 5) --- */}
      <section id="offer" className="py-32 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Sua saúde precisa de uma direção. Qual você vai escolher?">
            Apresentando: O Protocolo da Serenidade (Método de 14 Dias)
          </SectionTitle>
          
          <ProductMockup />

          <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-stone-100 mt-16 md:mt-24">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-8 md:p-16 bg-sage-dark text-white">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 md:mb-12 text-center">Investimento Simbólico</h2>
                <div className="space-y-8 md:space-y-10 text-lg md:text-xl leading-relaxed font-light px-4 md:px-0 text-center">
                  <p className="text-2xl md:text-3xl font-serif font-bold text-coral-text mb-8 md:mb-10">A Proteção da sua Jornada</p>
                  <p>
                    Se você sente paz no coração ao ler estas palavras, essa é a sua direção. O investimento é simbólico, para proteger esse segredo e garantir o seu compromisso.
                  </p>
                  <div className="space-y-4 md:space-y-6 bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-[3rem] border border-white/10">
                    <div className="flex justify-between items-center gap-4">
                      <span>Valor Real do Conhecimento:</span>
                      <span className="line-through text-white/50 shrink-0">R$ 197,00</span>
                    </div>
                    <div className="pt-6 md:pt-8 border-t border-white/10 flex justify-between items-center text-2xl md:text-3xl font-bold gap-4">
                      <span>Seu Investimento Hoje:</span>
                      <span className="text-coral-text shrink-0">R$ 27,90</span>
                    </div>
                  </div>
                  <p className="italic text-stone-300">
                    (Menos de R$ 1,00 por dia para ter sua vida de volta)
                  </p>
                  <p>
                    Ainda sofrendo com as mesmas dores ocultas ou com a vida "endireitada"? A escolha é sua.
                  </p>
                </div>
                
                <div className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-white/20">
                  <h4 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center">O que você vai receber:</h4>
                  <div className="grid gap-6 md:gap-8">
                    <div className="flex items-center gap-4 md:gap-6 justify-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-coral rounded-full flex items-center justify-center font-bold text-lg md:text-xl shrink-0">✓</div>
                      <p className="text-xl md:text-2xl">O Reset da Manhã: O ritual para sinalizar paz ao seu corpo logo ao acordar.</p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 justify-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-coral rounded-full flex items-center justify-center font-bold text-lg md:text-xl shrink-0">✓</div>
                      <p className="text-xl md:text-2xl">O Escudo Térmico: Como apagar o incêndio interno naturalmente.</p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 justify-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-coral rounded-full flex items-center justify-center font-bold text-lg md:text-xl shrink-0">✓</div>
                      <p className="text-xl md:text-2xl">O Mapa do Metabolismo Bama: Destrave a queima de gordura mesmo após os 50.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 p-10 md:p-16 flex flex-col justify-center items-center text-center bg-gradient-to-b from-stone-50 to-stone-100/50">
                <div className="mb-12 md:mb-14">
                  <p className="text-stone-600 text-xl md:text-2xl mb-10 leading-relaxed">
                    {quiz.userName}, você pode gastar R$ 800,00 em uma consulta para ouvir o que está aqui, ou investir o preço de uma única caixa de chá (R$ 0,93 por dia) para ter o método que as chinesas usam há séculos. Qual faz mais sentido para você?
                  </p>
                  <span className="inline-block px-6 py-3 bg-coral/10 text-coral-text font-bold rounded-full text-lg md:text-xl tracking-widest uppercase mb-6">
                    Acesso Imediato • 100% Digital
                  </span>
                  <div className="flex flex-col items-center justify-center mt-10">
                    <span className="text-stone-400 line-through text-2xl md:text-3xl font-medium">De: R$ 197,00</span>
                    <div className="text-2xl md:text-3xl font-bold text-sage-dark mt-4">Por apenas:</div>
                    <div className="text-6xl md:text-8xl font-bold text-coral-text mt-4 tracking-tight">
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
                  <Button variant="secondary" className="w-full py-6 md:py-8 text-xl md:text-2xl shadow-coral/30 bg-coral hover:bg-coral-dark">
                    👉 SIM! QUERO MINHA DIREÇÃO E MEU RESET DE 14 DIAS
                  </Button>
                </a>

                <p className="mt-10 text-stone-500 text-xl md:text-lg font-bold uppercase tracking-widest">
                  Acesso imediato via e-mail • Produto Digital
                </p>
                
                <div className="mt-16 flex flex-col items-center gap-8">
                  <div className="flex items-center gap-4 text-stone-400">
                    <ShieldCheck size={40} />
                    <span className="text-xl font-medium">Pagamento 100% Seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- GUARANTEE (BLOCK 6) --- */}
          <div className="mt-12 md:mt-32 max-w-5xl mx-auto bg-white p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-stone-100 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1000/1000951.png" 
                alt="Garantia" 
                className="w-full h-full object-contain opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center px-4 md:px-0">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-sage-dark mb-4 md:mb-8 uppercase">"Decisões Decidem Destinos"</h3>
              <p className="text-lg md:text-2xl text-stone-600 leading-relaxed font-light">
                Não tome uma decisão precipitada. Eu quero que você clique nesse botão apenas se sentir paz no coração. Para que você decida com total tranquilidade, eu te dou 7 dias de Garantia Incondicional. Se em uma semana você não sentir que seus caminhos estão se abrindo e sua saúde está se endireitando, eu devolvo 100% do seu investimento. O risco é meu. Sua paz é o que importa.
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
          <div className="bg-cream/50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-stone-100">
            <p className="text-xl md:text-lg text-stone-700 font-medium mb-6 md:mb-8 italic">
              "Nós entendemos a frustração de se sentir uma estranha no próprio corpo. Por isso, decodificamos o método que mantém as mulheres de Bama vibrantes há gerações."
            </p>
            <p className="text-xl md:text-lg text-stone-600 leading-relaxed font-light italic">
              O Protocolo da Serenidade não nasceu em laboratórios farmacêuticos, mas sim de uma busca incessante por respostas que a medicina convencional muitas vezes ignora. Somos um coletivo de pesquisadores independentes, nutricionistas e especialistas em saúde integrativa, apaixonados pela biologia da longevidade.
            </p>
            <p className="text-xl md:text-lg text-stone-600 leading-relaxed font-light italic mt-6 md:mt-8">
              Nossa equipe dedicou anos estudando o 'Paradoxo do Estrogênio' e as zonas azuis do mundo — como a Vila de Bama — para traduzir segredos ancestrais em um método prático de 14 dias. Nosso objetivo é claro: dar a cada mulher o mapa para que ela não seja refém dos seus hormônios, mas sim a mestre do seu próprio bem-estar.
            </p>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION (BLOCK 7) --- */}
      <section className="py-20 md:py-24 px-4 bg-sage-dark text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8 px-4">
            "{quiz.userName}, qual será sua direção?"
          </h2>
          
          <div className="space-y-8 md:space-y-10 text-lg md:text-lg leading-relaxed font-light max-w-6xl mx-auto">
            <p className="text-xl md:text-lg mb-8">Reflita: como você quer estar daqui a 14 dias?</p>
            
            <div className="text-center bg-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10">
              <h4 className="text-xl md:text-2xl font-serif font-bold text-coral-text mb-4 md:mb-6">Caminho da Estagnação:</h4>
              <p className="text-lg md:text-xl lg:text-2xl text-stone-300 leading-relaxed">
                Continuar "encurvada" por sintomas que ninguém resolve há anos, tratando apenas o galho e ignorando a raiz.
              </p>
            </div>

            <div className="text-center bg-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-xl">
              <h4 className="text-xl md:text-2xl font-serif font-bold text-sage mb-4 md:mb-6">Caminho da Direção:</h4>
              <p className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed">
                Ativar o segredo ancestral, silenciar o "Modo de Sobrevivência" e ter sua vida "endireitada" com paz e disposição.
              </p>
            </div>

            <div className="pt-6 md:pt-8">
              <p className="text-xl md:text-lg font-serif font-bold text-coral-text italic">
                "Se você sente paz no coração ao ler estas palavras, essa é a sua direção."
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
              <Button variant="secondary" className="w-full py-6 md:py-8 text-lg shadow-coral/40 bg-coral hover:bg-coral-dark">
                👉 SIM! QUERO MINHA DIREÇÃO E MEU RESET DE 14 DIAS
              </Button>
            </a>
            <p className="mt-8 text-stone-300 italic text-lg max-w-5xl mx-auto leading-relaxed">
              P.S: Lembre-se, você não corre risco nenhum. Se em 7 dias você não sentir que sua energia voltou ou que seu sono melhorou, eu devolvo cada centavo. Sem perguntas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-stone-400 text-lg font-bold uppercase tracking-widest">
              <span>Pagamento 100% Seguro</span>
              <span className="hidden md:inline">•</span>
              <span>Acesso Imediato via E-mail</span>
              <span className="hidden md:inline">•</span>
              <span>Garantia de 7 Dias</span>
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
              <div key={idx} className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-stone-100 shadow-md text-center">
                <h4 className="text-xl md:text-2xl font-serif font-bold text-sage-dark mb-4 md:mb-8">{item.q}</h4>
                <p className="text-lg md:text-2xl text-stone-600 leading-relaxed font-light">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-40 text-center text-stone-400 text-2xl border-t border-stone-200 pt-20">
            <p className="font-bold text-sage mb-6 tracking-widest uppercase text-2xl">Protocolo da Serenidade</p>
            <p>&copy; 2024. Todos os direitos reservados.</p>
            <p className="mt-8 text-lg md:text-xl max-w-5xl mx-auto leading-relaxed opacity-60">
              Este produto não substitui o parecer médico profissional. Sempre consulte seu médico antes de iniciar qualquer mudança na sua dieta ou estilo de vida.
            </p>
          </div>
        </div>
      </footer>
      
      {/* --- STICKY FLOATING BUTTON --- */}
      <AnimatePresence>
        {quiz.step === 'diagnosis' && showSticky && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-6 z-[100] md:hidden bg-white/80 backdrop-blur-md border-t border-stone-200"
          >
            <div className="text-center mb-2 text-stone-500 text-sm font-bold uppercase tracking-wider">
              🔒 Pagamento Seguro | Acesso Imediato
            </div>
            <a 
              href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="secondary" className="w-full py-3 text-lg shadow-2xl bg-coral hover:bg-coral-dark border-2 border-white/20">
                👉 SIM! QUERO MINHA DIREÇÃO E MEU RESET DE 14 DIAS
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quiz.step === 'diagnosis' && showSticky && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed bottom-12 right-12 z-[100] hidden md:block"
          >
            <div className="text-center mb-2 text-stone-500 text-sm font-bold uppercase tracking-wider bg-white/80 backdrop-blur-sm py-1 rounded-full px-4 shadow-sm border border-stone-100">
              🔒 Pagamento Seguro | Acesso Imediato
            </div>
            <a 
              href="https://pay.hotmart.com/Y98549636E?checkoutMode=10" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="secondary" className="py-6 md:py-8 px-8 md:px-12 text-xl md:text-2xl shadow-2xl bg-coral hover:bg-coral-dark border-2 md:border-4 border-white/20">
                👉 SIM! QUERO MINHA DIREÇÃO E MEU RESET DE 14 DIAS
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      </>
    )}
  </div>
);
}
