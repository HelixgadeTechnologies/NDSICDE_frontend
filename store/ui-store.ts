import { create } from "zustand";

type UIState = {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: () => void;
  closeEditModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isAddModalOpen: false,
  isEditModalOpen: false,
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  openEditModal: () => set({ isEditModalOpen: true }),
  closeEditModal: () => set({ isEditModalOpen: false }),
}));