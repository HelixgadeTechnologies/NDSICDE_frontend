export type CreateProjectFormDataType = {
  projectId?: string;
  projectName: string;
  budgetCurrency: string;
  totalBudgetAmount: string;
  startDate: string;
  endDate: string;
  country: string;
  targetStates: string[];
  targetLGAs: string[];
  targetCommunities: string[];
  thematicAreas: string[];
  assignedManagers: string[];
  strategicObjective: string;
  status: string;
};

// Define the actual API response type based on your data
export type ProjectApiResponse = {
  projectId: string;
  projectName: string | null;
  budgetCurrency: string;
  totalBudgetAmount: string;
  startDate: string;
  endDate: string;
  country: string;
  state: string;
  localGovernment: string;
  community: string;
  thematicAreasOrPillar: string;
  strategicObjectiveId: string;
  strategicObjectiveStatement: string;
  status: string;
  createAt: string;
  updateAt: string;
};