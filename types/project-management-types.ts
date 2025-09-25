// type for project team - add extra stuff when api comes
export type ProjectTeamDetails = {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive",
  lastActive: string;
}

export type ProjectPartnerTypes = {
  userId: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
}