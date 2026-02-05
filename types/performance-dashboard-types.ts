// Type declarations for the API response
export type SummaryAPIResponse = {
  summary: {
    totalActiveProjects: number;
    completedKPIsPercentage: number;
    pendingRequests: number;
    budgetUtilization: number;
    projectHealthScore: number;
    percentageFromLastPeriod: number;
  };
  kpiActualsVsTargets:
    | Array<{
        // Assuming these are objects with key-value pairs, adjust as needed
        [key: string]: string | number;
      }>
    | string[];
  statusDistribution: Array<{
    status: "On Track" | "Delays" | "At Risk";
    count: number;
    percentage: number;
  }>;
  progressTracking: {
    activity: {
      percentage: number;
      status: "Not Started" | "Started";
    };
    output: {
      percentage: number;
      status: "Not Started" | "Started" | "Completed";
    };
    outcomes: {
      percentage: number;
      status: "Not Started" | "Started" | "Completed";
    };
    impact: {
      percentage: number;
      status: "Not Started" | "Started" | "Completed";
    };
  };
  projectDetails: Array<{
    projectId: string;
    projectName: string;
    status: string; // More flexible than just "Active"
    startDate: string;
    endDate: string;
    totalBudget: number;
    budgetUtilization: number;
    healthScore: number;
    indicators: {
      total: number;
      achieved: number;
      pending: number;
      achievementRate: number;
    };
    activities: {
      total: number;
      completed: number;
      completionRate: number;
    };
    riskLevel: string; // More flexible than just "High"
  }>;
};

// Type for the full API response with data wrapper
export type APIResponse = {
  data: SummaryAPIResponse;
  message?: string;
  success?: boolean;
  status?: number;
};