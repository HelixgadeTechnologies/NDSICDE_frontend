// type for project team - add extra stuff when api comes
export type ProjectTeamDetails = {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  lastActive: string;
};

export type ProjectPartnerTypes = {
  userId: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
};

export type ProjectImpactTypes = {
  userId: string;
  impactStatement: string;
  thematicAreas: string;
  responsiblePerson: string;
};

export type ProjectRequestTypes = {
  userId: string;
  activityDescription: string;
  totalBudget: string;
  activityLocation: string;
  status: "Rejected" | "Approved";
  retirementStatus: "Retired" |" In Progress" | "Rejected"| "Not Retired";
  responsiblePersons: string;
  startDate: string;
  endDate: string;
};

export type ProjectActivityTypes = {
  userId: string;
  activityStatement: string;
  output: string;
  budget: string;
  startDate: string;
  endDate: string;
  responsiblePersons: string;
};

export type ProjectOutcomeTypes = {
  userId: string;
  projectOutcome: string;
  outcomeType: string;
  impact: string;
  thematicAreas: string;
  responsiblePerson: string;
};

export type ProjectOutputTypes = {
  userId: string;
  impactStatement: string;
  outcome: string;
  thematicAreas: string;
  responsiblePerson: string;
};
