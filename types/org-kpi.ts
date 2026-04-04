export type OrgKpiResponse = {
    THEMATIC_AREA_SUMMARY: {
      thematicArea: string;
      totalSOs: number;
      totalKPIs: number;
      overallKPIPerformance: number;
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
      kpiId: string;
      code: string;
      statement: string;
      thematicArea: string;
      strategicObjective: string;
      resultLevel: string;
      baseline: number;
      target: number;
      actual: number;
      performance: number;
      status: string;
    }[];
    PROJECT_INDICATOR_PERFORMANCE: {
      kpis: {
        kpiId: string;
        code: string;
        statement: string;
        actual: number;
        target: number;
        performance: number;
      }[];
      averagePerformance: number;
    };
  };