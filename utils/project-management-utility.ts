import { useState, useCallback } from "react";

export interface EntityModalStates<T> {
  editEntity: boolean;
  viewEntity: boolean;
  addEntity: boolean;
  removeEntity: boolean;
  selectedEntity: T | null;
  isLoading: boolean;
}

export interface EntityModalActions<T> {
  setAddEntity: (value: boolean) => void;
  setEditEntity: (value: boolean) => void;
  setViewEntity: (value: boolean) => void;
  setRemoveEntity: (value: boolean) => void;
  setSelectedEntity: (entity: T | null) => void;
  setIsLoading: (value: boolean) => void;
  handleViewEntity: (entity: T, setActiveRowId?: (id: string | null) => void) => void;
  handleEditEntity: (entity: T, setActiveRowId?: (id: string | null) => void) => void;
  handleRemoveEntity: (entity: T, setActiveRowId?: (id: string | null) => void) => void;
  handleAddEntity: () => void;
  closeAllModals: () => void;
  resetModal: () => void;
}

export function useEntityModal<T>(): EntityModalStates<T> & EntityModalActions<T> {
  const [editEntity, setEditEntity] = useState(false);
  const [viewEntity, setViewEntity] = useState(false);
  const [addEntity, setAddEntity] = useState(false);
  const [removeEntity, setRemoveEntity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<T | null>(null);

  const handleViewEntity = useCallback((entity: T, setActiveRowId?: (id: string | null) => void) => {
    setEditEntity(false);
    setRemoveEntity(false);
    setAddEntity(false);
    setSelectedEntity(entity);
    setViewEntity(true);
    setActiveRowId?.(null);
  }, []);

  const handleEditEntity = useCallback((entity: T, setActiveRowId?: (id: string | null) => void) => {
    setViewEntity(false);
    setRemoveEntity(false);
    setAddEntity(false);
    setSelectedEntity(entity);
    setEditEntity(true);
    setActiveRowId?.(null);
  }, []);

  const handleRemoveEntity = useCallback((entity: T, setActiveRowId?: (id: string | null) => void) => {
    setViewEntity(false);
    setEditEntity(false);
    setAddEntity(false);
    setSelectedEntity(entity);
    setRemoveEntity(true);
    setActiveRowId?.(null);
  }, []);

  const handleAddEntity = useCallback(() => {
    setViewEntity(false);
    setEditEntity(false);
    setRemoveEntity(false);
    setAddEntity(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setEditEntity(false);
    setViewEntity(false);
    setAddEntity(false);
    setRemoveEntity(false);
  }, []);

  const resetModal = useCallback(() => {
    closeAllModals();
    setSelectedEntity(null);
    setIsLoading(false);
  }, [closeAllModals]);

  return {
    editEntity,
    viewEntity,
    addEntity,
    removeEntity,
    selectedEntity,
    isLoading,
    setAddEntity,
    setEditEntity,
    setViewEntity,
    setRemoveEntity,
    setSelectedEntity,
    setIsLoading,
    handleViewEntity,
    handleEditEntity,
    handleRemoveEntity,
    handleAddEntity,
    closeAllModals,
    resetModal,
  };
}
