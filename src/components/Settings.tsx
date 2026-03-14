import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Shield, Bell, Globe, Save, Trash2, Info, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';

export default function Settings() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [activeSection, setActiveSection] = React.useState('profile');
  const [profileName, setProfileName] = React.useState(user?.name || '');
  const [profileEmail, setProfileEmail] = React.useState(user?.email || '');
  
  // Password state
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => fetch('/api/organizations').then(res => res.json())
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string, email: string }) =>
      fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      addNotification('Perfil atualizado com sucesso!', 'success');
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) =>
      fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Erro ao alterar senha');
        }
        return res.json();
      }),
    onSuccess: () => {
      addNotification('Senha alterada com sucesso!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err: any) => {
      addNotification(err.message, 'error');
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => fetch('/api/profile', { method: 'DELETE' }).then(res => res.json()),
    onSuccess: () => {
      logout();
      addNotification('Sua conta foi excluída permanentemente.', 'info');
    }
  });

  const updateOrgMutation = useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) =>
      fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addNotification('Organização atualizada!', 'success');
    }
  });

  const handleDeleteAccount = () => {
    if (window.confirm('TEM CERTEZA? Esta ação é irreversível e todos os seus dados serão apagados para sempre.')) {
      const confirmation = window.prompt('Para confirmar, digite "EXCLUIR MINHA CONTA":');
      if (confirmation === 'EXCLUIR MINHA CONTA') {
        deleteAccountMutation.mutate();
      } else {
        addNotification('Confirmação incorreta. A conta não foi excluída.', 'warning');
      }
    }
  };

  const navItems = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'organizations', label: 'Organizações', icon: Globe },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">Configurações</h1>
        <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF]">Gerencie seu perfil, organizações e preferências de segurança.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-2 md:p-4">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shrink-0 lg:shrink ${
                    activeSection === item.id 
                      ? "bg-[#F0FDF4] dark:bg-[#10B981]/10 text-[#10B981]" 
                      : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-gray-50 dark:hover:bg-[#1F2937]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-4 md:p-6">
            <h4 className="text-red-700 dark:text-red-400 font-bold text-sm mb-2">Zona de Perigo</h4>
            <p className="text-[10px] md:text-xs text-red-600 dark:text-red-300 mb-4">A exclusão da sua conta é permanente e não pode ser desfeita.</p>
            <button 
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
              className="w-full py-2.5 bg-white dark:bg-[#1F2937] border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Conta
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6 md:space-y-8">
          {activeSection === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#1F2937]/50">
                <h3 className="font-bold text-[#111827] dark:text-white">Perfil Pessoal</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Atualize suas informações básicas de contato.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Nome Completo</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Email</label>
                    <input 
                      type="email" 
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => updateProfileMutation.mutate({ name: profileName, email: profileEmail })}
                    disabled={updateProfileMutation.isPending}
                    className="bg-[#111827] dark:bg-white text-white dark:text-[#111827] px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-900/10 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'organizations' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#1F2937]/50">
                <h3 className="font-bold text-[#111827] dark:text-white">Suas Organizações</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Gerencie as configurações das organizações que você lidera.</p>
              </div>
              <div className="p-6 space-y-6">
                {organizations?.map((org: any) => (
                  <div key={org.id} className="p-6 bg-[#F9FAFB] dark:bg-[#1F2937]/30 border border-[#E5E7EB] dark:border-[#374151] rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold">
                          {org.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111827] dark:text-white">{org.name}</h4>
                          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{org.members.length} Membros</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[#10B981] bg-[#F0FDF4] dark:bg-[#10B981]/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Dono
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        defaultValue={org.name}
                        onBlur={(e) => {
                          if (e.target.value !== org.name) {
                            updateOrgMutation.mutate({ id: org.id, name: e.target.value });
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#10B981]/20 dark:text-white"
                      />
                      <button className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-white dark:hover:bg-[#1F2937] rounded-lg transition-colors">
                        <SettingsIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#1F2937]/50">
                <h3 className="font-bold text-[#111827] dark:text-white">Segurança da Conta</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Altere sua senha e gerencie as configurações de segurança.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Senha Atual</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Nova Senha</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Confirmar Nova Senha</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      if (newPassword !== confirmPassword) {
                        return addNotification('As senhas não coincidem', 'error');
                      }
                      changePasswordMutation.mutate({ currentPassword, newPassword });
                    }}
                    disabled={changePasswordMutation.isPending || !currentPassword || !newPassword}
                    className="bg-[#111827] dark:bg-white text-white dark:text-[#111827] px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-900/10 disabled:opacity-50"
                  >
                    <Shield className="w-4 h-4" />
                    Atualizar Senha
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#1F2937]/50">
                <h3 className="font-bold text-[#111827] dark:text-white">Preferências de Notificação</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Escolha como você deseja ser notificado sobre atividades.</p>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { id: 'email_alerts', label: 'Alertas por Email', desc: 'Receba alertas sobre acessos suspeitos.' },
                  { id: 'new_projects', label: 'Novos Projetos', desc: 'Notificar quando você for adicionado a um projeto.' },
                  { id: 'security_updates', label: 'Atualizações de Segurança', desc: 'Alertas sobre chaves expirando ou vulnerabilidades.' },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-[#1F2937]/30 border border-[#E5E7EB] dark:border-[#374151] rounded-2xl">
                    <div>
                      <h4 className="font-bold text-sm text-[#111827] dark:text-white">{pref.label}</h4>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{pref.desc}</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#10B981] cursor-pointer">
                      <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition" />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button 
                    onClick={() => addNotification('Preferências salvas!', 'success')}
                    className="bg-[#111827] dark:bg-white text-white dark:text-[#111827] px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-900/10"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Preferências
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
