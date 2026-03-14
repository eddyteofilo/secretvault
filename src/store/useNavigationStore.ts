import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  activeTab: string;
  selectedProjectId: string | null;
  setActiveTab: (tab: string) => void;
  setSelectedProjectId: (projectId: string | null) => void;
  navigateToCredentials: (projectId: string) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      activeTab: 'dashboard',
      selectedProjectId: null,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
      navigateToCredentials: (projectId) => set({ activeTab: 'credentials', selectedProjectId: projectId }),
    }),
    {
      name: 'navigation-storage',
    }
  )
);
