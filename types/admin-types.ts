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

export type FinancialReportApiResponse = {
  summary: {
    totalBudgetAllocated: number;
    totalExpensesIncurred: number;
    budgetVariance: number;
    budgetVariancePercentage: number;
    percentageFromLastPeriod: number;
  };
  budgetTrends: {
    name: string;
    budget: number;
    expenditure: number;
  }[];
  expenseBreakdown: {
    name: string;
    value: number;
  }[];
  projectPerformance: {
    projectId: string;
    projectName: string;
    approvedBudget: number;
    actualExpenses: number;
    variance: number;
    variancePercentage: number;
    status: string;
    cpi?: number;
    spi?: number;
  }[];
  budgetVsActuals: {
    projectId: string;
    projectName: string;
    approvedExpenses: number;
    actualExpenses: number;
    varianceAmount: number;
    variancePercentage: number;
    status: string;
  }[];
  detailedExpenses: {
    id: string | number;
    transactionID: string;
    project: string;
    date: string;
    category: string;
    amount: number;
    description: string;
  }[];
};