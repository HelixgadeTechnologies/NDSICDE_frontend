export type Target = {
  targetDate: string;
  cumulativeTarget: string;
  targetNarrative: string;
};

export type IndicatorDisaggregationItem = {
  indicatorDisaggregationId?: string;
  indicatorId?: string;
  type: string;
  category: string;
  value?: number | string; // baseline disaggregated value
  baseline?: number | string; // backend baseline disaggregated value
  target: number | string; // target disaggregated value
};

export type PeriodicTargetItem = {
  periodicTargetId?: string;
  indicatorId?: string;
  target: number | string;
  targetDate: string;
};


export type IndicatorFormData = {
  indicatorId: string;
  indicatorSource: string;
  orgKpiId: string;
  thematicAreasOrPillar: string;
  statement: string;
  linkKpiToSdnOrgKpi: string;
  definition: string;
  specificArea: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  baseLineDate: string;
  cumulativeValue: string;
  baselineNarrative: string;
  targetDate: string;
  cumulativeTarget: string;
  targetNarrative: string;
  targetType: string;
  responsiblePersons: string[];
  result: string;
  resultTypeId: string;
  isPeriodic: boolean;
  PeriodicTarget: PeriodicTargetItem[];
  IndicatorDisaggregation: IndicatorDisaggregationItem[];
};

export type IndicatorPayload = {
  isCreate: boolean;
  data: {
    indicatorId: string;
    indicatorSource: string;
    orgKpiId: string;
    thematicAreasOrPillar: string;
    statement: string;
    linkKpiToSdnOrgKpi: string;
    definition: string;
    specificArea: string;
    unitOfMeasure: string;
    itemInMeasure: string;
    baseLineDate: string;
    cumulativeValue: number | string;
    baselineNarrative: string;
    targetDate: string;
    cumulativeTarget: number | string;

    targetNarrative: string;
    targetType: string;
    responsiblePersons: string;
    result: string;
    resultTypeId: string;
    PeriodicTarget?: PeriodicTargetItem[];
    IndicatorDisaggregation: IndicatorDisaggregationItem[];
  };
};

export type IndicatorSourceData = {
  indicatorSource: string;
  thematicAreasOrPillar: string | null;
  statement: string | null;
  linkKpiToSdnOrgKpi: string | null;
};

