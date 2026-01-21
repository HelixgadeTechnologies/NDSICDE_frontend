export type Target = {
  targetDate: string;
  cumulativeTarget: string;
  targetNarrative: string;
};

export type IndicatorFormData = {
  indicatorId: string;
  indicatorSource: string;
  thematicAreasOrPillar: string;
  statement: string;
  linkKpiToSdnOrgKpi: string;
  definition: string;
  specificArea: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  disaggregationId: string;
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
};

export type IndicatorPayload = {
  isCreate: boolean;
  data: {
    indicatorId: string;
    indicatorSource: string;
    thematicAreasOrPillar: string;
    statement: string;
    linkKpiToSdnOrgKpi: string;
    definition: string;
    specificArea: string;
    unitOfMeasure: string;
    itemInMeasure: string;
    disaggregationId: string;
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
  };
};

export type IndicatorSourceData = {
  indicatorSource: string;
  thematicAreasOrPillar: string;
  statement: string;
};