/** Full KPI detail returned by /api/strategic-objectivesAndKpi/kpi/{id} */
export type OrgKpiDetail = {
    statement: string;
    definition: string;
    type: string;
    specificArea: string;
    unitOfMeasure: string;
    itemInMeasure: string;
    targetType: string;
    responsiblePersons: string;
    baseLineDate: string;
    cumulativeValue: number;
    baselineNarrative: string;
    targetDate: string;
    cumulativeTarget: number;
    targetNarrative: string;
  };

/** A single KPI row nested under a strategic objective in KPI_TABLE_DATA. */
export type OrgKpiRow = {
    kpiId: string;
    code: string;
    statement: string;
    resultLevel: string;
    baseline: number;
    target: number;
    actual: number;
    performance: number;
    status: string;
    /** Enriched client-side from the parent SO group (not in the raw payload). */
    thematicArea?: string;
    strategicObjective?: string;
  };

/** One strategic-objective group in KPI_TABLE_DATA, holding its KPIs. */
export type OrgKpiSOGroup = {
    strategicObjectiveId: string;
    strategicObjective: string;
    thematicArea: string;
    totalProjects: number;
    kpis: OrgKpiRow[];
  };

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
    KPI_TABLE_DATA: OrgKpiSOGroup[];
  };
