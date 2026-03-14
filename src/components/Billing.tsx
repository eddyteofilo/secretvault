import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Check, Shield, Zap, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useNotificationStore } from '../store/useNotificationStore';

export default function Billing() {
  const { addNotification } = useNotificationStore();
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: () => fetch('/api/billing').then(res => res.json())
  });

  const plans = [
    {
      id: 'FREE',
      name: 'Gratuito',
      price: 'R$ 0',
      description: 'Ideal para projetos pessoais e desenvolvedores individuais.',
      features: ['Até 1 projeto', '10 credenciais totais', 'Acesso básico', 'Criptografia AES-256']
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: 'R$ 49',
      description: 'Perfeito para pequenas equipes e startups em crescimento.',
      features: ['Projetos ilimitados', 'Credenciais ilimitadas', 'Logs de auditoria', 'Suporte prioritário', '2FA']
    },
    {
      id: 'TEAM',
      name: 'Equipe',
      price: 'R$ 149',
      description: 'Para empresas que precisam de controle total e segurança avançada.',
      features: ['Tudo do Pro', 'SSO / SAML', 'Políticas de acesso granulares', 'API de integração', 'Gerente de conta dedicado']
    }
  ];

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">Faturamento</h1>
        <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF]">Gerencie seu plano, métodos de pagamento e histórico de faturas.</p>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-5 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F0FDF4] dark:bg-[#10B981]/10 rounded-2xl flex items-center justify-center text-[#10B981]">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-[#6B7280] dark:text-[#9CA3AF] font-medium">Plano Atual</p>
              <h2 className="text-xl md:text-2xl font-bold text-[#111827] dark:text-white">{subscription?.plan}</h2>
            </div>
          </div>
          <div className="flex items-center self-start sm:self-center gap-2 text-[#10B981] bg-[#F0FDF4] dark:bg-[#10B981]/10 px-3 py-1 rounded-full text-sm font-bold">
            <Check className="w-4 h-4" />
            Ativo
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col ${
                subscription?.plan === plan.id 
                  ? 'border-[#10B981] bg-[#F0FDF4]/30 dark:bg-[#10B981]/5 ring-1 ring-[#10B981]' 
                  : 'border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#10B981] dark:hover:border-[#10B981]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-[#111827] dark:text-white">{plan.name}</h3>
                {subscription?.plan === plan.id && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] bg-white dark:bg-[#111827] px-2 py-0.5 rounded-full border border-[#10B981]">Atual</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#111827] dark:text-white">{plan.price}</span>
                <span className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">/mês</span>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6 min-h-[2.5rem]">{plan.description}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#374151] dark:text-[#D1D5DB]">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => addNotification('Redirecionando para o Stripe...', 'info')}
                disabled={subscription?.plan === plan.id}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  subscription?.plan === plan.id 
                    ? 'bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] text-[#9CA3AF] cursor-not-allowed' 
                    : 'bg-[#111827] dark:bg-white text-white dark:text-[#111827] hover:bg-black dark:hover:bg-gray-200 shadow-lg shadow-gray-900/10'
                }`}
              >
                {subscription?.plan === plan.id ? 'Plano Atual' : 'Mudar para ' + plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-6 md:p-8">
          <h3 className="font-bold text-lg text-[#111827] dark:text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#10B981]" />
            Método de Pagamento
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F9FAFB] dark:bg-[#1F2937]/50 border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-6 bg-[#111827] dark:bg-white rounded flex items-center justify-center text-[10px] text-white dark:text-[#111827] font-bold">VISA</div>
              <div>
                <p className="text-sm font-bold text-[#111827] dark:text-white">Visa final 4242</p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Expira em 12/2028</p>
              </div>
            </div>
            <button className="text-sm font-bold text-[#10B981] hover:underline self-start sm:self-center">Editar</button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-6 md:p-8">
          <h3 className="font-bold text-lg text-[#111827] dark:text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#10B981]" />
            Segurança de Faturamento
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Suas faturas são enviadas mensalmente para o email cadastrado.</p>
            </div>
            <button className="w-full py-3 bg-[#F3F4F6] dark:bg-[#1F2937] text-[#374151] dark:text-[#D1D5DB] rounded-xl font-bold text-sm hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors">
              Ver Histórico de Faturas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
