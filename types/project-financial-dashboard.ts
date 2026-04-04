export type ProjectFinancialDashboardResponse = {
    PROJECT_BUDGET_PERFORMANCE_SUMMARY: {
      totalActivities: number;
      onBudgetActivities: number;
      overBudgetActivities: number;
      underBudgetActivities: number;
      onScheduleActivities: number;
      behindScheduleActivities: number;
      aheadScheduleActivities: number;
      onBudgetPercentage: number;
      overBudgetPercentage: number;
      underBudgetPercentage: number;
      onSchedulePercentage: number;
    };
    ACTIVITY_OVERVIEW: {
      category: string;
      count: number;
      percentage: number;
    }[];
    IMPLEMENTATION_TIME_ANALYSIS: {
      chart: {
        outputId: string;
        outputStatement: string;
        totalPlannedDays: number;
        totalActualDays: number;
        activityCount: number;
      }[];
      table: {
        activityId: string;
        activityDescription: string;
        outputId: string;
        outputStatement: string;
        totalPlannedDays: number;
        totalActivitySpentDays: number;
        percentageDaysSpent: number;
        earnedValue: number;
        plannedValue: number;
        status: string;
        costVariance: number;
        scheduleVariance: number;
      }[];
    };
    BURN_RATE: {
      outputId: string;
      outputStatement: string;
      sumActualCost: number;
      sumBudget: number;
      burnRate: number;
    }[];
    ACTIVITY_FINANCIAL_DATA: {
      activityId: string;
      activityStatement: string;
      outputId: string;
      outputStatement: string;
      projectId: string;
      activityPlannedStartDate: string;
      activityPlannedEndDate: string;
      activityActualStartDate: string;
      activityActualEndDate: string;
      totalPlannedDays: number;
      totalDaysSpent: number;
      remainingDays: number;
      percentageDaysSpent: number;
      budgetAtCompletion: number;
      actualCost: number;
      percentageCompletion: number;
      earnedValue: number;
      plannedValue: number;
      costVariance: number;
      scheduleVariance: number;
      costPerformanceIndex: number;
      schedulePerformanceIndex: number;
      costPerformanceStatus: string;
      schedulePerformanceStatus: string;
      burnRate: number;
      implementationTimeAnalysis: string;
    }[];
};