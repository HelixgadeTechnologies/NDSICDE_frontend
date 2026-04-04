export type ProjectResultResponse = {
  RESULT_SUMMARY: {
    resultAndActivities: {
      totalImpacts: number;
      totalOutcomes: number;
      totalOutputs: number;
      totalActivities: number;
    };
    kpisDueForReporting: {
      impacts: number;
      outcomes: number;
      outputs: number;
    };
    overallPerformance: {
      impacts: number;
      outcomes: number;
      outputs: number;
      totalActivity: number;
    };
  };
  ACTIVITY_OVERVIEW: {
    category: string;
    count: number;
    percentage: number;
  }[];
  ACTIVITY_TABLE: {
    activityId: string;
    activityStatement: string;
    targetFrequency: number;
    actualFrequency: number;
    performance: number;
    status: string;
  }[];
  KPI_OVERVIEW_CHART: {
    monthly: {
      period: string;
      year: number;
      actual: number;
      target: number;
    }[];
    quarterly: {
      period: string;
      year: number;
      actual: number;
      target: number;
    }[];
    baseline: number;
    annualTarget: number;
  };
  KPI_TABLE_DATA: {
    indicatorId: string;
    code: string;
    statement: string;
    thematicArea: string;
    resultLevel: string;
    baseline: number;
    target: number;
    actual: number;
    performance: number;
    status: string;
  }[];
  PROJECT_INDICATOR_PERFORMANCE: {
    indicators: {
      indicatorId: string;
      code: string;
      statement: string;
      actual: number;
      target: number;
      performance: number;
    }[];
    averagePerformance: number;
  };
};