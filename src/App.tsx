import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useNavigationStore } from './store/useNavigationStore';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Credentials from './components/Credentials';
import Team from './components/Team';
import Billing from './components/Billing';
import Settings from './components/Settings';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';

const queryClient = new QueryClient();

export default function App() {
  const { user, token } = useAuthStore();
  const { theme } = useThemeStore();
  const { activeTab, setActiveTab } = useNavigationStore();
  const [showAuth, setShowAuth] = React.useState(false);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  if (!user || !token) {
    return (
      <QueryClientProvider client={queryClient}>
        {showAuth ? (
          <div className="relative">
             <button 
                onClick={() => setShowAuth(false)}
                className="fixed top-8 left-8 z-50 text-sm font-bold text-[#6B7280] hover:text-[#10B981] flex items-center gap-1 transition-colors"
             >
                ← Voltar
             </button>
             <Auth />
          </div>
        ) : (
          <LandingPage onGetStarted={() => setShowAuth(true)} />
        )}
      </QueryClientProvider>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'projects': return <Projects />;
      case 'credentials': return <Credentials />;
      case 'team': return <Team />;
      case 'billing': return <Billing />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </QueryClientProvider>
  );
}
