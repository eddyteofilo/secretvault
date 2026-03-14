import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Shield, 
  Globe, 
  Server, 
  Code,
  Search,
  Filter,
  ChevronRight,
  Lock,
  Calendar,
  Activity,
  KeyRound,
  Folder as FolderIcon, 
  Edit2, 
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CreateCredentialModal from './CreateCredentialModal';

import { useNotificationStore } from '../store/useNotificationStore';
import { useNavigationStore } from '../store/useNavigationStore';

export default function Credentials() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { selectedProjectId, setSelectedProjectId } = useNavigationStore();
  const [selectedCredentialId, setSelectedCredentialId] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingCredential, setEditingCredential] = React.useState<any>(null);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [visibleFields, setVisibleFields] = React.useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = React.useState('');

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/credentials/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Falha ao excluir credencial');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', selectedProjectId] });
      setSelectedCredentialId(null);
    },
    onError: (error: any) => {
      alert(error.message);
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este segredo? Esta ação não pode ser desfeita.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (credential: any) => {
    setEditingCredential(credential);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingCredential(null);
  };

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json())
  });

  const { data: selectedProject } = useQuery({
    queryKey: ['project', selectedProjectId],
    queryFn: () => fetch(`/api/projects/${selectedProjectId}`).then(res => res.json()),
    enabled: !!selectedProjectId
  });

  const { data: credentials, isLoading } = useQuery({
    queryKey: ['credentials', selectedProjectId],
    queryFn: () => fetch(`/api/credentials?projectId=${selectedProjectId}`).then(res => res.json()),
    enabled: !!selectedProjectId
  });

  const filteredCredentials = React.useMemo(() => {
    if (!credentials) return [];
    return credentials.filter((cred: any) => 
      cred.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [credentials, searchQuery]);

  const { data: selectedCredential } = useQuery({
    queryKey: ['credential', selectedCredentialId],
    queryFn: () => fetch(`/api/credentials/${selectedCredentialId}`).then(res => res.json()),
    enabled: !!selectedCredentialId
  });

  const copyToClipboard = (text: string, fieldId: string, isSensitive: boolean) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    if (isSensitive) {
      addNotification(`Acesso sensível: Campo copiado em "${selectedCredential?.name}"`, 'warning');
    }
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleVisibility = (fieldId: string, isSensitive: boolean) => {
    const newVisible = !visibleFields[fieldId];
    setVisibleFields(prev => ({ ...prev, [fieldId]: newVisible }));
    if (newVisible && isSensitive) {
      addNotification(`Acesso sensível: Campo visualizado em "${selectedCredential?.name}"`, 'warning');
    }
  };

  const addSecretFieldMutation = useMutation({
    mutationFn: async (credential: any) => {
      const newField = {
        fieldName: 'Chave de API Secreta',
        value: 'sk_test_' + Math.random().toString(36).substring(7),
        isSensitive: true
      };
      
      const updatedFields = [...(credential.fields || []), newField];
      
      const res = await fetch(`/api/credentials/${credential.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: credential.name,
          description: credential.description,
          environment: credential.environment,
          projectId: credential.projectId,
          fields: updatedFields
        })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Falha ao adicionar campo');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credential', selectedCredentialId] });
      queryClient.invalidateQueries({ queryKey: ['credentials', selectedProjectId] });
      addNotification('Campo "Chave de API Secreta" adicionado com sucesso!', 'success');
    },
    onError: (error: any) => {
      addNotification(error.message, 'error');
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Credenciais</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Gerencie suas chaves de API e segredos com segurança.</p>
          
          {selectedProjectId && selectedProject && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <FolderIcon className="w-4 h-4 text-[#10B981]" />
                <h2 className="font-bold text-[#111827] dark:text-white">{selectedProject.name}</h2>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">{selectedProject.description || 'Sem descrição disponível.'}</p>
              <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-[#9CA3AF]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Criado em {new Date(selectedProject.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {credentials?.length || 0} Segredos
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
          >
            <option value="">Selecionar Projeto</option>
            {projects?.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!selectedProjectId}
            className="bg-[#10B981] hover:bg-[#059669] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
            title={!selectedProjectId ? "Selecione um projeto primeiro" : "Adicionar novo segredo"}
          >
            <Plus className="w-5 h-5" />
            Adicionar Segredo
          </button>
        </div>
      </div>

      {!selectedProjectId ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-[#D1D5DB] dark:border-[#374151] p-8 md:p-12 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F3F4F6] dark:bg-[#1F2937] rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderIcon className="w-6 h-6 md:w-8 md:h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-[#111827] dark:text-white">Nenhum projeto selecionado</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-xs mx-auto mt-2">Selecione um projeto no menu acima para ver suas credenciais.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Search Bar */}
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <input 
            type="text" 
            placeholder="Buscar credencial pelo nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl shadow-sm focus:ring-2 focus:ring-[#10B981]/20 outline-none transition-all dark:text-white dark:placeholder-[#6B7280] text-sm md:text-base"
          />
        </div>
          {/* List */}
          <div className={cn(
            "lg:col-span-1 space-y-4",
            selectedCredentialId ? "hidden lg:block" : "block"
          )}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input 
                type="text" 
                placeholder="Filtrar segredos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-lg text-sm focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white dark:placeholder-[#6B7280]"
              />
            </div>
            
            <div className="space-y-2">
              {filteredCredentials?.map((cred: any) => (
                <button
                  key={cred.id}
                  onClick={() => setSelectedCredentialId(cred.id)}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all group",
                    selectedCredentialId === cred.id 
                      ? "bg-[#F0FDF4] dark:bg-[#064E3B]/20 border-[#10B981] shadow-sm" 
                      : "bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#10B981]"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#111827] dark:text-white truncate pr-2">{cred.name}</span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform shrink-0",
                      selectedCredentialId === cred.id ? "text-[#10B981] translate-x-1" : "text-[#9CA3AF]"
                    )} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      cred.environment === 'production' ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    )}>
                      {cred.environment === 'production' ? 'Produção' : cred.environment === 'staging' ? 'Homologação' : 'Desenvolvimento'}
                    </span>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{cred.fields?.length || 0} campos</span>
                  </div>
                </button>
              ))}
              {filteredCredentials.length === 0 && searchQuery && (
                <div className="text-center py-8 text-[#6B7280] dark:text-[#9CA3AF] text-sm italic">
                  Nenhum segredo encontrado para "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className={cn(
            "lg:col-span-2",
            !selectedCredentialId ? "hidden lg:block" : "block"
          )}>
            <AnimatePresence mode="wait">
              {selectedCredentialId && selectedCredential ? (
                <motion.div
                  key={selectedCredential.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
                >
                  <div className="p-4 md:p-6 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#1F2937]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 lg:hidden">
                          <button 
                            onClick={() => setSelectedCredentialId(null)}
                            className="text-[#10B981] text-xs font-bold flex items-center gap-1"
                          >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            Voltar
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h2 className="text-lg md:text-xl font-bold text-[#111827] dark:text-white truncate">{selectedCredential.name}</h2>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            selectedCredential.environment === 'production' ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                          )}>
                            {selectedCredential.environment === 'production' ? 'Produção' : selectedCredential.environment === 'staging' ? 'Homologação' : 'Desenvolvimento'}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2">{selectedCredential.description || 'Sem descrição'}</p>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 ml-4">
                        <button 
                          onClick={() => handleEdit(selectedCredential)}
                          className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-white dark:hover:bg-[#111827] hover:shadow-sm rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(selectedCredential.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-[10px] md:text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Criado em {new Date(selectedCredential.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Criptografado com AES-256
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 space-y-6">
                    {selectedCredential.fields?.map((field: any) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] md:text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider">{field.fieldName}</label>
                          <div className="flex items-center gap-1">
                            {field.isSensitive && (
                              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Sensível
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative min-w-0">
                            <input 
                              type={field.isSensitive && !visibleFields[field.id] ? "password" : "text"}
                              value={field.value}
                              readOnly
                              className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl text-sm font-mono focus:outline-none dark:text-white truncate"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {field.isSensitive && (
                              <button 
                                onClick={() => toggleVisibility(field.id, field.isSensitive)}
                                className="p-2 md:p-2.5 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-xl transition-colors"
                                title={visibleFields[field.id] ? "Ocultar valor" : "Mostrar valor"}
                              >
                                {visibleFields[field.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            )}
                            <button 
                              onClick={() => copyToClipboard(field.value, field.id, field.isSensitive)}
                              className={cn(
                                "p-2 md:p-2.5 rounded-xl transition-all",
                                copiedField === field.id ? "bg-[#10B981] text-white" : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937]"
                              )}
                              title="Copiar para área de transferência"
                            >
                              {copiedField === field.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addSecretFieldMutation.mutate(selectedCredential)}
                      disabled={addSecretFieldMutation.isPending}
                      className="w-full py-3 border-2 border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] hover:border-[#10B981] hover:text-[#10B981] transition-all flex items-center justify-center gap-2 group"
                    >
                      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Adicionar Chave de API Secreta
                    </button>
                  </div>

                  <div className="p-4 md:p-6 bg-[#F9FAFB] dark:bg-[#1F2937] border-t border-[#E5E7EB] dark:border-[#1F2937]">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Acessado por você há 2 minutos</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F3F4F6] dark:bg-[#1F2937] rounded-full flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6 md:w-8 md:h-8 text-[#9CA3AF]" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[#111827] dark:text-white">Selecione um segredo</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-xs mx-auto mt-2">Escolha uma credencial na lista à esquerda para ver detalhes e gerenciar campos.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <CreateCredentialModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseModal} 
        projectId={selectedProjectId}
        credential={editingCredential}
      />
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

