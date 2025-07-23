import { useState } from "react";
import { UserDetails } from "@/types/team-members";

export interface TeamMemberModalStates {
  editTeamMember: boolean;
  viewTeamMember: boolean;
  deleteTeamMember: boolean;
  addTeamMember: boolean;
  selectedUser: UserDetails | null;
}

export interface TeamMemberModalActions {
  setEditTeamMember: (value: boolean) => void;
  setViewTeamMember: (value: boolean) => void;
  setDeleteTeamMember: (value: boolean) => void;
  setAddTeamMember: (value: boolean) => void;
  setSelectedUser: (user: UserDetails | null) => void;
  handleViewUser: (user: UserDetails, setActiveRowId?: (id: number | null) => void) => void;
  handleEditUser: (user: UserDetails, setActiveRowId?: (id: number | null) => void) => void;
  handleDeleteUser: (user: UserDetails, setActiveRowId?: (id: number | null) => void) => void;
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
  
  // State to track the selected user
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  // Function to handle viewing a user
  const handleViewUser = (user: UserDetails, setActiveRowId?: (id: number | null) => void) => {
    setSelectedUser(user);
    setViewTeamMember(true);
    setActiveRowId?.(null);
  };

  // Function to handle editing a user
  const handleEditUser = (user: UserDetails, setActiveRowId?: (id: number | null) => void) => {
    setSelectedUser(user);
    setEditTeamMember(true);
    setActiveRowId?.(null);
  };

  // Function to handle deleting a user
  const handleDeleteUser = (user: UserDetails, setActiveRowId?: (id: number | null) => void) => {
    setSelectedUser(user);
    setDeleteTeamMember(true);
    setActiveRowId?.(null);
  };

  // Function to handle adding a user
  const handleAddUser = () => {
    setAddTeamMember(true);
  };

  // Function to close all modals
  const closeAllModals = () => {
    setEditTeamMember(false);
    setViewTeamMember(false);
    setDeleteTeamMember(false);
  };

  // Function to reset all modal state
  const resetModalState = () => {
    closeAllModals();
    setSelectedUser(null);
  };

  return {
    // States
    editTeamMember,
    viewTeamMember,
    deleteTeamMember,
    addTeamMember,
    selectedUser,
    
    // State setters
    setEditTeamMember,
    setViewTeamMember,
    setDeleteTeamMember,
    setAddTeamMember,
    setSelectedUser,
    
    // Action handlers
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleAddUser,
    closeAllModals,
    resetModalState,
  };
}