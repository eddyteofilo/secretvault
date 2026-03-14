import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MoreVertical, Folder, ExternalLink, Trash2, Edit2, X } from 'lucide-react';
import { motion } from 'motion/react';

import { useNotificationStore } from '../store/useNotificationStore';
import { useNavigationStore } from '../store/useNavigationStore';

export default function Projects() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { navigateToCredentials } = useNavigationStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  const [newProject, setNewProject] = React.useState({ name: '', description: '', organizationId: '' });

  const { data: orgs } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => fetch('/api/organizations').then(res => res.json())
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json())
  });

  const createProjectMutation = useMutation({
    mutationFn: (project: any) => fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    }).then(res => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreateModalOpen(false);
      setNewProject({ name: '', description: '', organizationId: '' });
      addNotification(`Novo projeto criado: ${data.name}`, 'success');
    }
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px] text-[#6B7280] dark:text-[#9CA3AF]">Carregando projetos...</div>;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">Projetos</h1>
          <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF]">Gerencie e organize suas credenciais por projeto.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#10B981]/20"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects?.map((project: any, i: number) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigateToCredentials(project.id)}
            className="bg-white dark:bg-[#111827] p-5 md:p-6 rounded-3xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F3F4F6] dark:bg-[#1F2937] rounded-2xl flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                <Folder className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(project);
                }}
                className="p-2 text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white rounded-lg"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-1 truncate">{project.name}</h3>
            <p className="text-xs md:text-sm text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2 mb-6 h-10">
              {project.description || 'Nenhuma descrição fornecida.'}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6] dark:border-[#1F2937]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-bold text-[#111827] dark:text-[#F9FAFB] bg-[#F3F4F6] dark:bg-[#1F2937] px-2 py-1 rounded">
                  {project._count?.credentials || 0} Credenciais
                </span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToCredentials(project.id);
                }}
                className="text-[#10B981] hover:text-[#059669] text-xs md:text-sm font-bold flex items-center gap-1"
              >
                Visualizar APIs
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Criar Novo Projeto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1">Nome do Projeto</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-[#1F2937] border border-[#D1D5DB] dark:border-[#374151] rounded-lg focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none dark:text-white"
                  placeholder="ex: Sistema de Pagamentos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1">Descrição</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-[#1F2937] border border-[#D1D5DB] dark:border-[#374151] rounded-lg focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none h-24 resize-none dark:text-white"
                  placeholder="Sobre o que é este projeto?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1">Organização</label>
                <select 
                  value={newProject.organizationId}
                  onChange={(e) => setNewProject({ ...newProject, organizationId: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-[#1F2937] border border-[#D1D5DB] dark:border-[#374151] rounded-lg focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none dark:text-white"
                >
                  <option value="">Selecione uma organização</option>
                  {orgs?.map((org: any) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-2 border border-[#D1D5DB] dark:border-[#374151] text-[#374151] dark:text-[#D1D5DB] rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#1F2937]"
              >
                Cancelar
              </button>
              <button 
                onClick={() => createProjectMutation.mutate(newProject)}
                disabled={!newProject.name || !newProject.organizationId}
                className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] disabled:opacity-50"
              >
                Criar Projeto
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-2xl p-8 relative"
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#F3F4F6] dark:bg-[#1F2937] rounded-2xl flex items-center justify-center text-[#10B981]">
                <Folder className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#111827] dark:text-white">{selectedProject.name}</h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">Detalhes do Projeto</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider mb-2">Descrição</h4>
                <p className="text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                  {selectedProject.description || 'Nenhuma descrição fornecida para este projeto.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F9FAFB] dark:bg-[#1F2937] p-4 rounded-xl border border-[#F3F4F6] dark:border-[#1F2937]">
                  <p className="text-xs text-[#9CA3AF] font-bold uppercase mb-1">Credenciais</p>
                  <p className="text-xl font-bold text-[#111827] dark:text-white">{selectedProject._count?.credentials || 0}</p>
                </div>
                <div className="bg-[#F9FAFB] dark:bg-[#1F2937] p-4 rounded-xl border border-[#F3F4F6] dark:border-[#1F2937]">
                  <p className="text-xs text-[#9CA3AF] font-bold uppercase mb-1">Criado em</p>
                  <p className="text-sm font-bold text-[#111827] dark:text-white">
                    {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F3F4F6] dark:border-[#1F2937]">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full px-4 py-3 bg-[#F3F4F6] dark:bg-[#1F2937] text-[#374151] dark:text-[#D1D5DB] rounded-xl font-bold hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors"
                >
                  Fechar Detalhes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
