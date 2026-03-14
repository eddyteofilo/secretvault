import React from 'react';
import { X, Plus, Trash2, Shield, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const COMMON_FIELD_NAMES = [
  "Chave de API",
  "Chave Secreta",
  "ID do Cliente",
  "Segredo do Cliente",
  "Token de Acesso",
  "Token de Atualização",
  "Token Bearer",
  "Chave Privada",
  "Chave Pública",
  "Chave de Assinatura",
  "Segredo do Webhook",
  "ID do App",
  "ID do Projeto",
  "ID do Tenant",
  "ID da Organização",
  "ID da Conta",
  "URL Base",
  "URL do Endpoint",
  "Região",
  "Ambiente",
  "URL de Retorno",
  "URI de Redirecionamento",
  "Escopo"
];

interface CreateCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  credential?: any;
}

export default function CreateCredentialModal({ isOpen, onClose, projectId, credential }: CreateCredentialModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [environment, setEnvironment] = React.useState('development');
  const [fields, setFields] = React.useState([{ fieldName: 'API Key', value: '', isSensitive: true }]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (credential) {
      setName(credential.name || '');
      setDescription(credential.description || '');
      setEnvironment(credential.environment || 'development');
      setFields(credential.fields?.map((f: any) => ({
        fieldName: f.fieldName,
        value: f.value || '',
        isSensitive: f.isSensitive
      })) || [{ fieldName: 'API Key', value: '', isSensitive: true }]);
    } else {
      resetForm();
    }
  }, [credential, isOpen]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = credential ? `/api/credentials/${credential.id}` : '/api/credentials';
      const method = credential ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Falha ao ${credential ? 'atualizar' : 'criar'} credencial`);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', projectId] });
      if (credential) {
        queryClient.invalidateQueries({ queryKey: ['credential', credential.id] });
      }
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      setErrorMessage(error.message);
    }
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setEnvironment('development');
    setFields([{ fieldName: 'API Key', value: '', isSensitive: true }]);
    setErrorMessage(null);
  };

  const addField = () => {
    setFields([...fields, { fieldName: '', value: '', isSensitive: true }]);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validação
    if (!name.trim()) {
      setErrorMessage('O nome da credencial é obrigatório.');
      return;
    }

    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].fieldName.trim()) {
        setErrorMessage(`O nome do campo #${i + 1} é obrigatório.`);
        return;
      }
      if (!fields[i].value.trim()) {
        setErrorMessage(`O valor do campo "${fields[i].fieldName}" é obrigatório.`);
        return;
      }
    }

    createMutation.mutate({
      name,
      description,
      projectId,
      environment,
      fields
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#1F2937] shrink-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white">{credential ? 'Editar Segredo' : 'Adicionar Novo Segredo'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-[#111827] rounded-xl transition-colors">
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {!projectId ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Info className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">Projeto Necessário</h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-xs mx-auto">
                Você deve selecionar um projeto antes de adicionar um novo segredo.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#111827] dark:bg-white dark:text-[#111827] text-white rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              {errorMessage && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
                  {errorMessage}
                </div>
              )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Nome da Credencial</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Stripe API Produção"
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Ambiente</label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none dark:text-white"
                >
                  <option value="development">Desenvolvimento</option>
                  <option value="staging">Homologação</option>
                  <option value="production">Produção</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Descrição (Opcional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Para que esta credencial é usada?"
                className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl focus:ring-2 focus:ring-[#10B981]/20 outline-none h-20 resize-none dark:text-white"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB]">Campos e Valores</label>
                <button
                  type="button"
                  onClick={addField}
                  className="text-xs font-bold text-[#10B981] flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Adicionar Campo
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="p-4 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-2xl space-y-4 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Nome do Campo</label>
                        <input
                          type="text"
                          list={`field-names-${index}`}
                          value={field.fieldName}
                          onChange={(e) => updateField(index, 'fieldName', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#10B981]/20 dark:text-white"
                          placeholder="ex: API_KEY"
                        />
                        <datalist id={`field-names-${index}`}>
                          {COMMON_FIELD_NAMES.map(name => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Valor</label>
                        <input
                          type="text"
                          required
                          value={field.value}
                          onChange={(e) => updateField(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#10B981]/20 font-mono dark:text-white"
                          placeholder="Digite o valor..."
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-[#374151]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.isSensitive}
                          onChange={(e) => updateField(index, 'isSensitive', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-[#374151] text-[#10B981] focus:ring-[#10B981] dark:bg-[#111827]"
                        />
                        <span className="text-xs font-medium text-[#374151] dark:text-[#D1D5DB] flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-500" /> Marcar como sensível
                        </span>
                      </label>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Campos sensíveis são criptografados com AES-256 antes de serem armazenados. Eles serão mascarados na interface e só podem ser visualizados por membros autorizados da equipe.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-xl font-bold text-[#374151] dark:text-[#D1D5DB] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 px-4 py-3 bg-[#111827] dark:bg-white text-white dark:text-[#111827] rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-900/10 disabled:opacity-50"
              >
                {createMutation.isPending ? (credential ? 'Salvando...' : 'Criando...') : (credential ? 'Salvar Alterações' : 'Criar Segredo')}
              </button>
            </div>
          </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
