import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  KeyRound, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Search,
  Bell,
  User as UserIcon,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'projects', label: 'Projetos', icon: FolderKanban },
    { id: 'credentials', label: 'Credenciais', icon: KeyRound },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'billing', label: 'Faturamento', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#111827] dark:text-[#F9FAFB] font-sans transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-[#1F2937] p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
            <KeyRound className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">SecretHub</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-[#F3F4F6] dark:bg-[#1F2937] text-[#10B981]" 
                  : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] hover:text-[#111827] dark:hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#450A0A] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside 
            className="w-64 h-full bg-white dark:bg-[#111827] p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                  <KeyRound className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight dark:text-white">SecretHub</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="dark:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === item.id 
                      ? "bg-[#F3F4F6] dark:bg-[#1F2937] text-[#10B981]" 
                      : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] hover:text-[#111827] dark:hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
            <button
              onClick={logout}
              className="mt-auto w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#450A0A] transition-colors"
            >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#1F2937] rounded-lg dark:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input 
                type="text" 
                placeholder="Buscar credenciais..."
                className="pl-10 pr-4 py-2 bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] w-64 lg:w-96 dark:text-white dark:placeholder-[#6B7280]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] rounded-lg transition-colors"
              title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] rounded-lg relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white dark:border-[#111827]"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[60]" 
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-[#1F2937] z-[70] overflow-hidden"
                    >
                      <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#1F2937]">
                        <h3 className="font-bold text-sm dark:text-white">Notificações</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-[#10B981] hover:underline"
                          >
                            Marcar todas como lidas
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-[#6B7280] dark:text-[#9CA3AF] text-sm italic">
                            Nenhuma notificação por enquanto.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={cn(
                                "p-4 border-b border-[#F3F4F6] dark:border-[#1F2937] last:border-0 transition-colors cursor-pointer",
                                !n.read ? "bg-[#F0FDF4] dark:bg-[#064E3B]/20" : "hover:bg-gray-50 dark:hover:bg-[#1F2937]"
                              )}
                              onClick={() => markAsRead(n.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-2 h-2 mt-1.5 rounded-full shrink-0",
                                  !n.read ? "bg-[#10B981]" : "bg-transparent"
                                )} />
                                <div className="space-y-1">
                                  <p className="text-sm text-[#111827] dark:text-[#F9FAFB] leading-snug">{n.message}</p>
                                  <p className="text-[10px] text-[#9CA3AF]">
                                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-[#E5E7EB] dark:bg-[#1F2937] hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none dark:text-white">{user?.name}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">{user?.email}</p>
              </div>
              <div className="w-8 h-8 bg-[#F3F4F6] dark:bg-[#1F2937] rounded-full flex items-center justify-center text-[#10B981] font-bold">
                {user?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
