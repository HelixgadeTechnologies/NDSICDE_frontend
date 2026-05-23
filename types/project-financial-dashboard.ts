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
      outputId: string;
      outputStatement: string;
      activityCount: number;
      totalPlannedDays: number;
      totalActualDays: number;
      activities: {
        activityId: string;
        activityDescription: string;
        totalPlannedDays: number;
        totalActivitySpentDays: number;
        percentageDaysSpent: number;
        earnedValue: number;
        plannedValue: number;
        status: string;
        costVariance: number;
        scheduleVariance: number;
      }[];
    }[];
    BURN_RATE: {
      outputId: string;
      outputStatement: string;
      totalBudget: number;
      totalSpent: number;
      burnRate: number;
      activities: {
        activityId: string;
        activityStatement: string;
        totalBudget: number;
        totalSpent: number;
        burnRate: number;
      }[];
    }[];
    ACTIVITY_FINANCIAL_DATA: {
      outputId: string;
      outputStatement: string;
      activityCount: number;
      activities: {
        activityId: string;
        activityStatement: string;
        targetFrequency: number;
        actualFrequency: number;
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
        lineItemTotalBudget: number;
        lineItemTotalSpent: number;
        lineItemBurnRate: number;
        burnRate: number;
        implementationTimeAnalysis: string;
      }[];
    }[];
};