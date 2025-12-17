// app/stores/useProjectStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProjectData {
  projectId: string;
  projectName: string;
  budgetCurrency: string;
  totalBudgetAmount: string;
  startDate: string;
  endDate: string;
  country: string;
  state: string;
  localGovernment: string;
  community: string;
  thematicAreasOrPillar: string;
  status: string;
  strategicObjectiveId: string;
}

interface ProjectStore {
  data: ProjectData;
  updateField: (field: keyof ProjectData, value: string) => void;
  updateMultipleFields: (updates: Partial<ProjectData>) => void;
  reset: () => void;
  setData: (data: ProjectData) => void;
  // Helper to check if field needs updating
  shouldUpdateField: (field: keyof ProjectData, value: string) => boolean;
}

const initialData: ProjectData = {
  projectId: '',
  projectName: '',
  budgetCurrency: '',
  totalBudgetAmount: '',
  startDate: '',
  endDate: '',
  country: '',
  state: '',
  localGovernment: '',
  community: '',
  thematicAreasOrPillar: '',
  status: 'draft', // Set default status here
  strategicObjectiveId: '',
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      
      shouldUpdateField: (field, value) => {
        return get().data[field] !== value;
      },
      
      updateField: (field, value) => {
        // Prevent unnecessary updates
        if (get().data[field] === value) return;
        
        set((state) => ({
          data: {
            ...state.data,
            [field]: value,
          },
        }));
      },
      
      updateMultipleFields: (updates) => {
        const currentData = get().data;
        const hasChanges = Object.entries(updates).some(
          ([key, value]) => currentData[key as keyof ProjectData] !== value
        );
        
        if (!hasChanges) return;
        
        set((state) => ({
          data: {
            ...state.data,
            ...updates,
          },
        }));
      },
      
      reset: () => {
        set({
          data: initialData,
        });
      },
      
      setData: (data) => {
        set({
          data,
        });
      },
    }),
    {
      name: 'project-storage',
      // Optional: Only persist specific fields
      partialize: (state) => ({ data: state.data }),
    }
  )
);