import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, Shield, User, Mail, MessageCircle, Share2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from '../store/useNotificationStore';

export default function Team() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('DEVELOPER');
  const [showShareOptions, setShowShareOptions] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => fetch('/api/organizations').then(res => res.json())
  });

  const inviteMutation = useMutation({
    mutationFn: ({ orgId, email, role }: { orgId: string, email: string, role: string }) =>
      fetch(`/api/organizations/${orgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      }).then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Falha ao convidar membro');
        }
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setInviteEmail('');
      addNotification('Membro adicionado com sucesso!', 'success');
    },
    onError: (error: any) => {
      addNotification(error.message, 'error');
    }
  });

  const handleShareEmail = (orgName: string) => {
    const subject = encodeURIComponent(`Convite para participar da equipe ${orgName}`);
    const body = encodeURIComponent(`Olá!\n\nVocê foi convidado para participar da nossa equipe na plataforma de gestão de segredos.\n\nOrganização: ${orgName}\nCargo: ${inviteRole}\n\nPara acessar, utilize o link: ${window.location.origin}`);
    window.location.href = `mailto:${inviteEmail}?subject=${subject}&body=${body}`;
  };

  const handleShareWhatsApp = (orgName: string) => {
    const text = encodeURIComponent(`*Convite de Equipe*\n\nOlá! Você foi convidado para participar da nossa equipe *${orgName}*.\n\nCargo: ${inviteRole}\n\nAcesse agora: ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    addNotification('Link de acesso copiado!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const removeMemberMutation = useMutation({
    mutationFn: ({ orgId, memberId }: { orgId: string, memberId: string }) =>
      fetch(`/api/organizations/${orgId}/members/${memberId}`, {
        method: 'DELETE'
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addNotification('Membro removido com sucesso', 'info');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ orgId, memberId, role }: { orgId: string, memberId: string, role: string }) =>
      fetch(`/api/organizations/${orgId}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addNotification('Cargo atualizado', 'success');
    }
  });

  if (!organizations) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Equipe</h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF]">Gerencie os membros da sua organização e seus níveis de acesso.</p>
      </div>

      {organizations.map((org: any) => (
        <div key={org.id} className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#1F2937]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                {org.name[0]}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-[#111827] dark:text-white truncate">{org.name}</h2>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{org._count.projects} Projetos</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
              <div className="flex flex-1 gap-2">
                <input 
                  type="email"
                  placeholder="Email do novo membro"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#1F2937] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#10B981]/20 dark:text-white min-w-0"
                />
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="px-2 py-2 bg-white dark:bg-[#1F2937] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#10B981]/20 dark:text-white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="DEVELOPER">Dev</option>
                  <option value="VIEWER">Ver</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => inviteMutation.mutate({ orgId: org.id, email: inviteEmail, role: inviteRole })}
                  disabled={!inviteEmail || inviteMutation.isPending}
                  className="flex-1 sm:flex-none bg-[#111827] dark:bg-white text-white dark:text-[#111827] px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-gray-200 disabled:opacity-50"
                  title="Adicionar membro diretamente"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="sm:hidden lg:inline">Adicionar</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowShareOptions(showShareOptions === org.id ? null : org.id)}
                    className="p-2 bg-[#F3F4F6] dark:bg-[#1F2937] text-[#374151] dark:text-[#D1D5DB] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors"
                    title="Compartilhar convite"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {showShareOptions === org.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-[40]" 
                          onClick={() => setShowShareOptions(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-xl z-[50] overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => {
                                handleShareEmail(org.name);
                                setShowShareOptions(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#374151] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-lg transition-colors"
                            >
                              <Mail className="w-4 h-4 text-blue-500" />
                              Enviar por E-mail
                            </button>
                            <button
                              onClick={() => {
                                handleShareWhatsApp(org.name);
                                setShowShareOptions(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#374151] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-lg transition-colors"
                            >
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              Enviar via WhatsApp
                            </button>
                            <div className="h-px bg-[#E5E7EB] dark:border-[#1F2937] my-1" />
                            <button
                              onClick={() => {
                                handleCopyLink();
                                setShowShareOptions(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#374151] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-lg transition-colors"
                            >
                              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                              Copiar Link de Acesso
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#F3F4F6] dark:divide-[#1F2937]">
            {org.members.map((member: any) => (
              <div key={member.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1F2937]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F3F4F6] dark:bg-[#1F2937] rounded-full flex items-center justify-center text-[#9CA3AF]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#111827] dark:text-white">{member.user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                      <Mail className="w-3.5 h-3.5" />
                      {member.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#10B981]" />
                    <select 
                      value={member.role}
                      onChange={(e) => updateRoleMutation.mutate({ orgId: org.id, memberId: member.id, role: e.target.value })}
                      className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB] bg-transparent border-none focus:ring-0 cursor-pointer"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="DEVELOPER">Desenvolvedor</option>
                      <option value="VIEWER">Visualizador</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover este membro?')) {
                        removeMemberMutation.mutate({ orgId: org.id, memberId: member.id });
                      }
                    }}
                    className="p-2 text-[#9CA3AF] hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
