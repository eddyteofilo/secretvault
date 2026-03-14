import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'motion/react';

export default function Auth() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });
  const [error, setError] = React.useState('');
  const setAuth = useAuthStore(state => state.setAuth);

  const authMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        let errorMessage = 'Falha na autenticação';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const err = await res.json();
            errorMessage = err.error || errorMessage;
          } else {
            const text = await res.text();
            console.error('Resposta de erro não-JSON:', text);
            errorMessage = `Erro no servidor (${res.status}). Tente novamente mais tarde.`;
          }
        } catch (e) {
          console.error('Erro ao analisar resposta de erro:', e);
        }
        throw new Error(errorMessage);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta inválida do servidor. Verifique se o backend está rodando.');
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      if (isLogin) {
        setAuth(data.user, data.token);
      } else {
        setIsLogin(true);
        setError('Conta criada! Por favor, faça login.');
      }
    },
    onError: (err: any) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    authMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg shadow-[#10B981]/20">
            <KeyRound className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#111827] dark:text-white">SecretHub</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-[#E5E7EB] dark:border-[#1F2937] p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white">{isLogin ? 'Bem-vindo de volta' : 'Criar conta'}</h1>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              {isLogin ? 'Digite suas credenciais para acessar seus segredos.' : 'Comece a gerenciar suas chaves de API com segurança hoje.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#374151] dark:text-[#D1D5DB] flex items-center gap-2">
                  <User className="w-4 h-4" /> Nome
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none transition-all dark:text-white"
                  placeholder="Seu Nome"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#374151] dark:text-[#D1D5DB] flex items-center gap-2">
                <Mail className="w-4 h-4" /> Endereço de Email
              </label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none transition-all dark:text-white"
                placeholder="nome@empresa.com"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#374151] dark:text-[#D1D5DB] flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Senha
                </label>
                {isLogin && (
                  <button type="button" className="text-xs font-bold text-[#10B981] hover:underline">Esqueceu a senha?</button>
                )}
              </div>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={authMutation.isPending}
              className="w-full bg-[#111827] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-[#111827] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50 mt-4"
            >
              {authMutation.isPending ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar conta')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB] dark:border-[#1F2937]"></div>
              </div>
              <span className="relative px-4 bg-white dark:bg-[#111827] text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Ou continue com</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors font-semibold text-sm dark:text-white">
                <Github className="w-5 h-5" /> GitHub
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors font-semibold text-sm dark:text-white">
                <Chrome className="w-5 h-5" /> Google
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-[#10B981] hover:underline"
          >
            {isLogin ? 'Cadastre-se grátis' : 'Entre aqui'}
          </button>
        </p>
      </motion.div>

      <footer className="mt-auto py-8 text-center text-xs text-[#9CA3AF] font-medium">
        &copy; 2026 SecretHub Inc. Todos os direitos reservados. • <button className="hover:underline">Política de Privacidade</button> • <button className="hover:underline">Termos de Serviço</button>
      </footer>
    </div>
  );
}
