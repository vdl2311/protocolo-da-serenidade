import React from 'react';
import { ChevronLeft, Mail, Shield, FileText } from 'lucide-react';

interface LegalProps {
  type: 'privacy' | 'terms' | 'contact';
  onBack: () => void;
  email: string;
}

export const LegalView: React.FC<LegalProps> = ({ type, onBack, email }) => {
  const content = {
    privacy: {
      title: 'Política de Privacidade',
      icon: <Shield className="text-rose" size={32} />,
      text: (
        <div className="space-y-6 text-mid leading-relaxed">
          <p>Sua privacidade é importante para nós. É política do Protocolo da Serenidade respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site.</p>
          
          <h3 className="text-dark font-serif text-xl font-medium">1. Coleta de Informações</h3>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
          
          <h3 className="text-dark font-serif text-xl font-medium">2. Uso de Dados</h3>
          <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. Nosso site pode ter links para sites externos que não são operados por nós.</p>
          
          <h3 className="text-dark font-serif text-xl font-medium">3. Segurança</h3>
          <p>Protegemos os dados armazenados dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
          
          <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados. O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais.</p>
        </div>
      )
    },
    terms: {
      title: 'Termos de Uso',
      icon: <FileText className="text-rose" size={32} />,
      text: (
        <div className="space-y-6 text-mid leading-relaxed">
          <p>Ao acessar ao site Protocolo da Serenidade, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
          
          <h3 className="text-dark font-serif text-xl font-medium">1. Uso de Licença</h3>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Protocolo da Serenidade, apenas para visualização transitória pessoal e não comercial.</p>
          
          <h3 className="text-dark font-serif text-xl font-medium">2. Isenção de Responsabilidade</h3>
          <p>Os materiais no site do Protocolo da Serenidade são fornecidos 'como estão'. O Protocolo da Serenidade não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.</p>
          
          <h3 className="text-dark font-serif text-xl font-medium">3. Limitações</h3>
          <p>Em nenhum caso o Protocolo da Serenidade ou seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais.</p>
          
          <h3 className="text-dark font-serif text-xl font-medium">4. Precisão dos Materiais</h3>
          <p>Os materiais exibidos no site podem incluir erros técnicos, tipográficos ou fotográficos. O Protocolo da Serenidade não garante que qualquer material em seu site seja preciso, completo ou atual.</p>
        </div>
      )
    },
    contact: {
      title: 'Contato',
      icon: <Mail className="text-rose" size={32} />,
      text: (
        <div className="space-y-8 text-center py-12">
          <p className="text-mid text-lg">Tem alguma dúvida ou precisa de suporte? Entre em contato conosco através do e-mail oficial:</p>
          
          <div className="bg-white border border-rose/20 p-8 rounded-2xl inline-block shadow-sm">
            <a 
              href={`mailto:${email}`} 
              className="text-rose font-serif text-2xl md:text-3xl font-medium hover:underline flex items-center gap-3 justify-center"
            >
              <Mail size={24} />
              {email}
            </a>
          </div>
          
          <p className="text-light text-sm max-w-md mx-auto mt-8">
            Nosso tempo médio de resposta é de até 48 horas úteis. <br />
            Estamos aqui para ajudar você na sua jornada de transformação.
          </p>
        </div>
      )
    }
  };

  const current = content[type];

  return (
    <div className="min-h-screen bg-warm-white py-20 px-5">
      <div className="container max-w-3xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-mid hover:text-rose transition-colors mb-12 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para a página principal
        </button>
        
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-rose/10">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-rose-light rounded-2xl flex items-center justify-center mb-6">
              {current.icon}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-dark font-medium">{current.title}</h1>
          </div>
          
          <div className="text-lg leading-relaxed text-mid">
            {current.text}
          </div>
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-sm text-light uppercase tracking-widest">© 2026 Protocolo da Serenidade</p>
        </div>
      </div>
    </div>
  );
};
