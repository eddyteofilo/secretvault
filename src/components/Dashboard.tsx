import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  Activity, 
  Folder, 
  Key, 
  Clock,
  ArrowUpRight,
  Eye,
  ChevronRight,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigationStore } from '../store/useNavigationStore';

export default function Dashboard() {
  const { navigateToCredentials, setActiveTab } = useNavigationStore();
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json())
  });

  const stats = [
    { label: 'Total de Projetos', value: projects?.length || 0, icon: Folder, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total de Credenciais', value: projects?.reduce((acc: number, p: any) => acc + (p._count?.credentials || 0), 0) || 0, icon: Key, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Pontuação de Segurança', value: '98%', icon: Shield, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Acessos Recentes', value: '12', icon: Activity, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">Bem-vindo de volta!</h1>
        <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF]">Aqui está o que está acontecendo com seus segredos hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#111827] p-4 md:p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-2 md:p-3 rounded-xl"}>
                <stat.icon className={stat.color + " w-5 h-5 md:w-6 md:h-6"} />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +12%
              </span>
            </div>
            <p className="text-xs md:text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">{stat.label}</p>
            <p className="text-xl md:text-2xl font-bold text-[#111827] dark:text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
            <h2 className="font-bold text-lg dark:text-white">Projetos Recentes</h2>
            <button 
              onClick={() => setActiveTab('projects')}
              className="text-sm text-[#10B981] font-medium hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-[#E5E7EB] dark:divide-[#1F2937]">
            {projects?.slice(0, 4).map((project: any) => (
              <div 
                key={project.id} 
                onClick={() => navigateToCredentials(project.id)}
                className="p-4 flex items-center gap-4 hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937] flex items-center justify-center shrink-0 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                  <Folder className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                    {project._count?.credentials || 0} Credenciais • Criado em {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#9CA3AF] group-hover:text-[#10B981] transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {(!projects || projects.length === 0) && (
              <div className="p-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                Nenhum projeto encontrado.
              </div>
            )}
          </div>
        </div>

        {/* Security Checklist */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-6">
          <h2 className="font-bold text-lg mb-6 dark:text-white">Checklist de Segurança</h2>
          <div className="space-y-6">
            {[
              { label: '2FA Ativado', status: 'completed' },
              { label: 'Rotacionar Chaves de Produção', status: 'pending' },
              { label: 'Revisão de Logs de Auditoria', status: 'completed' },
              { label: 'Revisão de Membros da Equipe', status: 'completed' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                  item.status === 'completed' ? "bg-[#10B981] border-[#10B981]" : "border-[#D1D5DB] dark:border-[#4B5563]"
                )}>
                  {item.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    item.status === 'completed' ? "text-[#111827] dark:text-[#F9FAFB]" : "text-[#6B7280] dark:text-[#9CA3AF]"
                  )}>{item.label}</p>
                  {item.status === 'pending' && (
                    <button 
                      onClick={() => setActiveTab('credentials')}
                      className="text-xs text-[#10B981] font-medium mt-1 hover:underline"
                    >
                      Completar agora
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-[#F0FDF4] dark:bg-[#064E3B]/20 rounded-xl border border-[#BBF7D0] dark:border-[#064E3B]">
            <p className="text-xs font-bold text-[#166534] dark:text-[#34D399] uppercase tracking-wider">Dica Pro</p>
            <p className="text-sm text-[#166534] dark:text-[#A7F3D0] mt-1">Rotacione suas chaves de produção a cada 90 dias para manter a segurança máxima.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
