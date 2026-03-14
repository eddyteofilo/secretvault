import React from 'react';
import { motion } from 'motion/react';
import { 
  KeyRound, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Globe, 
  ChevronRight, 
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] selection:bg-[#10B981]/30 selection:text-[#10B981]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg shadow-[#10B981]/20">
                <KeyRound className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#111827] dark:text-white">SecretHub</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors">Funcionalidades</a>
              <a href="#security" className="text-sm font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors">Segurança</a>
              <a href="#pricing" className="text-sm font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors">Preços</a>
              <button 
                onClick={onGetStarted}
                className="bg-[#111827] dark:bg-white text-white dark:text-[#111827] px-6 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-sm shadow-lg shadow-gray-900/10"
              >
                Entrar
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-[#374151] dark:text-[#D1D5DB]"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#1F2937] p-4 flex flex-col gap-4"
          >
            <a href="#features" className="p-2 text-lg font-medium dark:text-white">Funcionalidades</a>
            <a href="#security" className="p-2 text-lg font-medium dark:text-white">Segurança</a>
            <a href="#pricing" className="p-2 text-lg font-medium dark:text-white">Preços</a>
            <button 
              onClick={onGetStarted}
              className="bg-[#10B981] text-white p-4 rounded-xl font-bold"
            >
              Começar Agora
            </button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-[500px]">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#10B981]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl delay-1000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 text-[#10B981] rounded-full text-sm font-bold mb-6 border border-[#10B981]/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Agora com Criptografia de Ponta-a-Ponta</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#111827] dark:text-white tracking-tight mb-6 leading-tight">
              Gerencie seus segredos <br />
              <span className="bg-gradient-to-r from-[#10B981] to-emerald-400 bg-clip-text text-transparent">com confiança absoluta.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-[#6B7280] dark:text-[#9CA3AF] mb-10 leading-relaxed">
              O SecretHub é o cofre digital projetado para desenvolvedores e empresas que não abrem mão da segurança. Proteja suas chaves de API, credenciais e variáveis de ambiente em um único lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-[#111827] dark:bg-white text-white dark:text-[#111827] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-2xl shadow-gray-900/20"
              >
                Criar Conta Grátis
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#1F2937] text-[#374151] dark:text-[#D1D5DB] border border-[#E5E7EB] dark:border-[#374151] rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Ver Demonstração
              </button>
            </div>

            {/* Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-20 relative p-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="bg-[#111827] rounded-[2rem] p-4 aspect-[16/9] border border-gray-700 shadow-inner">
                 <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                 </div>
                 <div className="grid grid-cols-12 gap-4 h-full">
                    <div className="col-span-3 border-r border-gray-800 space-y-4">
                       <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
                       <div className="h-4 w-1/2 bg-gray-800 rounded"></div>
                       <div className="h-4 w-2/3 bg-gray-800 rounded"></div>
                    </div>
                    <div className="col-span-9 space-y-4">
                       <div className="grid grid-cols-3 gap-4">
                          <div className="h-24 bg-gray-800/50 rounded-2xl border border-gray-700/50"></div>
                          <div className="h-24 bg-gray-800/50 rounded-2xl border border-gray-700/50"></div>
                          <div className="h-24 bg-gray-800/50 rounded-2xl border border-gray-700/50"></div>
                       </div>
                       <div className="h-64 bg-gray-800/30 rounded-2xl border border-gray-700/30"></div>
                    </div>
                 </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAFB] dark:from-[#0A0A0A] via-transparent to-transparent pointer-events-none"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-[#0C0C0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-[#10B981] uppercase tracking-[0.2em] mb-4">Funcionalidades</h2>
            <p className="text-4xl font-extrabold text-[#111827] dark:text-white">Tudo que você precisa para gestão segura</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Lock className="w-8 h-8" />, 
                title: "Criptografia GCM", 
                desc: "Seus dados são protegidos com algoritmos AES-256-GCM, garantindo integridade e sigilo."
              },
              { 
                icon: <Zap className="w-8 h-8" />, 
                title: "Acesso Instantâneo", 
                desc: "Acesse suas chaves de API em segundos através da nossa interface flúida e rápida."
              },
              { 
                icon: <Globe className="w-8 h-8" />, 
                title: "Equipes e Permissões", 
                desc: "Gerencie múltiplos membros com diferentes níveis de acesso e auditoria completa."
              }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-[#F9FAFB] dark:bg-[#111827] rounded-[2rem] border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#10B981] transition-all group">
                <div className="w-16 h-16 bg-white dark:bg-[#1F2937] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151] group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all text-[#10B981]">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{f.title}</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-y border-[#E5E7EB] dark:border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-2xl font-bold text-gray-500">NEXT.JS</span>
                <span className="text-2xl font-bold text-gray-500">SUPABASE</span>
                <span className="text-2xl font-bold text-gray-500">PRISMA</span>
                <span className="text-2xl font-bold text-gray-500">TAILWIND</span>
            </div>
            <p className="mt-12 text-[#6B7280] dark:text-[#9CA3AF] font-medium">Contando com as melhores tecnologias do mercado para sua segurança.</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#111827] dark:text-white mb-4">Planos simples para todos</h2>
            <p className="text-[#6B7280] dark:text-[#9CA3AF]">Sem taxas ocultas. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {/* Free Plan */}
            <div className="p-10 bg-white dark:bg-[#111827] rounded-[2.5rem] border border-[#E5E7EB] dark:border-[#1F2937] flex flex-col h-full relative overflow-hidden">
              <div className="mb-8">
                <h3 className="text-2xl font-bold dark:text-white mb-2">Comunitário</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold dark:text-white">R$ 0</span>
                  <span className="text-[#6B7280]">/mês</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {['Até 10 credenciais', '1 Projeto', 'Interface limpa', 'Suporte via fórum'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-[#4B5563] dark:text-[#D1D5DB]">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-[#E5E7EB] dark:border-[#374151] font-bold dark:text-white hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-all">Começar agora</button>
            </div>

            {/* Pro Plan */}
            <div className="p-10 bg-[#111827] dark:bg-white rounded-[2.5rem] flex flex-col h-full relative shadow-2xl shadow-[#10B981]/20">
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-[#10B981] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-[#10B981]/40">Popular</div>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white dark:text-[#111827] mb-2">Profissional</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white dark:text-[#111827]">R$ 49</span>
                  <span className="text-gray-400">/mês</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {['Credenciais ilimitadas', 'Projetos ilimitados', 'Auditoria completa', 'Membros ilimitados', 'Suporte prioritário'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-gray-300 dark:text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onGetStarted}
                className="w-full py-4 rounded-2xl bg-[#10B981] text-white font-bold hover:scale-[1.02] transition-all shadow-xl shadow-[#10B981]/20"
              >
                Assinar Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1F2937] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                  <KeyRound className="text-white w-5 h-5" />
                </div>
                <span className="font-black text-xl tracking-tight text-[#111827] dark:text-white underline-offset-4 decoration-[#10B981] decoration-2">SecretHub</span>
              </div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">
                A plataforma mais segura <br /> para gestão de segredos <br /> e credenciais.
              </p>
            </div>
            {['Produto', 'Empresa', 'Legal'].map((col, i) => (
              <div key={i} className="flex flex-col gap-4">
                <h4 className="font-bold text-[#111827] dark:text-white">{col}</h4>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#10B981] cursor-pointer">Funcionalidades</span>
                  <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#10B981] cursor-pointer">Sobre nós</span>
                  <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#10B981] cursor-pointer">Segurança</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-[#E5E7EB] dark:border-[#1F2937] gap-4">
            <span className="text-[#9CA3AF] text-sm font-medium">© 2026 SecretHub. Feito com ❤️ e segurança.</span>
            <div className="flex gap-8">
              <Globe className="w-5 h-5 text-[#9CA3AF] hover:text-[#10B981] transition-colors cursor-pointer" />
              <ShieldCheck className="w-5 h-5 text-[#9CA3AF] hover:text-[#10B981] transition-colors cursor-pointer" />
              <Lock className="w-5 h-5 text-[#9CA3AF] hover:text-[#10B981] transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
