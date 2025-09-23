import { useState, useCallback } from "react";
import { UserDetails } from "@/types/team-members";

export interface TeamMemberModalStates {
  editTeamMember: boolean;
  viewTeamMember: boolean;
  deleteTeamMember: boolean;
  addTeamMember: boolean;
  selectedUser: UserDetails | null;
  isLoading: boolean; // Added for better UX
}

export interface TeamMemberModalActions {
  setEditTeamMember: (value: boolean) => void;
  setViewTeamMember: (value: boolean) => void;
  setDeleteTeamMember: (value: boolean) => void;
  setAddTeamMember: (value: boolean) => void;
  setSelectedUser: (user: UserDetails | null) => void;
  setIsLoading: (value: boolean) => void; // Added for loading states
  handleViewUser: (user: UserDetails, setActiveRowId?: (id: string | null) => void) => void;
  handleEditUser: (user: UserDetails, setActiveRowId?: (id: string | null) => void) => void;
  handleDeleteUser: (user: UserDetails, setActiveRowId?: (id: string | null) => void) => void;
  handleAddUser: () => void;
  closeAllModals: () => void;
  resetModalState: () => void;
}

export function useTeamMemberModal(): TeamMemberModalStates & TeamMemberModalActions {
  // Modal states
  const [editTeamMember, setEditTeamMember] = useState(false);
  const [viewTeamMember, setViewTeamMember] = useState(false);
  const [deleteTeamMember, setDeleteTeamMember] = useState(false);
  const [addTeamMember, setAddTeamMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State to track the selected user
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  // Function to handle viewing a user
  const handleViewUser = useCallback((user: UserDetails, setActiveRowId?: (id: string | null) => void) => {
    // Close other modals first to prevent conflicts
    setEditTeamMember(false);
    setDeleteTeamMember(false);
    setAddTeamMember(false);
    
    // Set the selected user and open view modal
    setSelectedUser(user);
    setViewTeamMember(true);
    setActiveRowId?.(null);
  }, []);

  // Function to handle editing a user
  const handleEditUser = useCallback((user: UserDetails, setActiveRowId?: (id: string | null) => void) => {
    // Close other modals first to prevent conflicts
    setViewTeamMember(false);
    setDeleteTeamMember(false);
    setAddTeamMember(false);
    
    // Set the selected user and open edit modal
    setSelectedUser(user);
    setEditTeamMember(true);
    setActiveRowId?.(null);
  }, []);

  // Function to handle deleting a user
  const handleDeleteUser = useCallback((user: UserDetails, setActiveRowId?: (id: string | null) => void) => {
    // Close other modals first to prevent conflicts
    setViewTeamMember(false);
    setEditTeamMember(false);
    setAddTeamMember(false);
    
    // Set the selected user and open delete modal
    setSelectedUser(user);
    setDeleteTeamMember(true);
    setActiveRowId?.(null);
  }, []);

  // Function to handle adding a user
  const handleAddUser = useCallback(() => {
    // Close other modals first
    setViewTeamMember(false);
    setEditTeamMember(false);
    setDeleteTeamMember(false);
    
    // Clear selected user (since we're adding new)
    setSelectedUser(null);
    setAddTeamMember(true);
  }, []);

  // Function to close all modals
  const closeAllModals = useCallback(() => {
    setEditTeamMember(false);
    setViewTeamMember(false);
    setDeleteTeamMember(false);
    setAddTeamMember(false);
    setIsLoading(false);
  }, []);

  // Function to reset all modal state
  const resetModalState = useCallback(() => {
    closeAllModals();
    setSelectedUser(null);
  }, [closeAllModals]);


  return {
    // States
    editTeamMember,
    viewTeamMember,
    deleteTeamMember,
    addTeamMember,
    selectedUser,
    isLoading,
    
    // Enhanced state setters
    setEditTeamMember,
    setViewTeamMember,
    setDeleteTeamMember,
    setAddTeamMember,
    setSelectedUser,
    setIsLoading,
    
    // Action handlers
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleAddUser,
    closeAllModals,
    resetModalState,
  };
}