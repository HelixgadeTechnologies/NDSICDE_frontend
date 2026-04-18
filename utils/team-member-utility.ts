import { useState, useCallback } from "react";
import { UserDetails } from "@/types/team-members";

export const TEAM_DESIGNATIONS = [
  { label: "Country Director", value: "Country Director" },
  { label: "Program Manager", value: "Program Manager" },
  { label: "Assistant Program Manager", value: "Assistant Program Manager" },
  { label: "Finance Manager", value: "Finance Manager" },
  { label: "Admin Manager", value: "Admin Manager" },
  { label: "Head, MEAL", value: "Head, MEAL" },
  { label: "Senior Finance Officer", value: "Senior Finance Officer" },
  { label: "Project Manager", value: "Project Manager" },
  { label: "Senior Project Officer", value: "Senior Project Officer" },
  { label: "Senior MEAL Officer", value: "Senior MEAL Officer" },
  { label: "MEAL Officer", value: "MEAL Officer" },
  { label: "Project Officer", value: "Project Officer" },
  { label: "Finance Officer", value: "Finance Officer" },
  { label: "Admin Officer", value: "Admin Officer" },
  { label: "Security Officer", value: "Security Officer" },
  { label: "MEAL Assistant", value: "MEAL Assistant" },
  { label: "Project Assistant", value: "Project Assistant" },
  { label: "Finance Assistant", value: "Finance Assistant" },
  { label: "Admin Assistant", value: "Admin Assistant" },
  { label: "Transport Officer", value: "Transport Officer" },
];

export const RR_APPROVAL_ROLE = [
  {label:" Layer 1 (PM, SPO, MEAL-Head)", value:"layer 1"},
  {label:" Layer 2 (Security Officer)", value:"layer 2"},
  {label:" Layer 3 (Project Finance Officer)", value:"layer 3"},
  {label:" Layer 4 (Finance Manager)", value:"layer 4"},
  {label:" Layer 5 ( Country Director)", value:"layer 5"},
  {label:" None", value:"none"}
]

export const ACTIVITY_KPI_APPROVAL_ROLE = [
 {label:"No access", value:"no access"},
 {label:"Grant access", value:"grant access"}
]

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