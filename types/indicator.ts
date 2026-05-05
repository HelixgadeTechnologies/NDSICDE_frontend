export type Target = {
  targetDate: string;
  cumulativeTarget: string;
  targetNarrative: string;
};

export type IndicatorDisaggregationItem = {
  indicatorDisaggregationId: string;
  indicatorId: string;
  type: string;
  category: string;
  value: number; // baseline disaggregated value (sums to cumulativeValue)
  target: number; // target disaggregated value (sums to cumulativeTarget)
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
    cumulativeValue: number;
    baselineNarrative: string;
    targetDate: string;
    cumulativeTarget: number;
    targetNarrative: string;
    targetType: string;
    responsiblePersons: string;
    result: string;
    resultTypeId: string;
    IndicatorDisaggregation: IndicatorDisaggregationItem[];
  };
};

export type IndicatorSourceData = {
  indicatorSource: string;
  thematicAreasOrPillar: string;
  statement: string;
};
