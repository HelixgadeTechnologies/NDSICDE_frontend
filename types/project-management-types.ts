// type for project team - add extra stuff when api comes
export type ProjectTeamDetails = {
  teamMemberId: string;
  fullName: string;
  email: string;
  roleName: string;
  projectName: string;
  updateAt: string;
};

export type ProjectPartnerTypes = {
  partnerId: string;
  organizationName: string;
  email: string;
  roleId: string;
  projectId: string;
  roleName?: string;
  projectName?: string;
  createAt?: string;
  updateAt: string;
};

export type ProjectImpactTypes = {
  impactId: string;
  statement: string;
  thematicArea: string;
  responsiblePerson: string;
  projectId: string;
  resultTypeId: string;
};

export type ProjectRequestType = {
  requestId: string;
  staff: string;
  outputId: string;
  activityTitle: string;
  activityBudgetCode: number;
  activityLocation: string;
  activityPurposeDescription: string;
  activityStartDate: string;
  activityEndDate: string;
  activityLineDescription: string;
  quantity: number;
  frequency: number;
  unitCost: number;
  budgetCode: number;
  total: number;
  modeOfTransport: string;
  driverName: string;
  driversPhoneNumber: string;
  vehiclePlateNumber: string;
  vehicleColor: string;
  departureTime: string;
  route: string;
  recipientPhoneNumber: string;
  documentName: string;
  documentURL: string;
  projectId: string;
  status: string;
};

export type ProjectActivityTypes = {
  activityId: string;
  activityStatement: string;
  outputId: string;
  activityTotalBudget: 0;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  activityFrequency: 0;
  subActivity: string;
  descriptionAction: string;
  deliveryDate: string;
  projectId: string;
};

export type ProjectActivityReportTypes = {
  activityReportId: string;
  activityId: string;
  activityStatement: string;
  activityTotalBudget: number;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  percentageCompletion: number;
  actualStartDate: string;
  actualEndDate: string;
  actualCost: number;
  actualNarrative: string;
  createAt: string;
  updateAt?: string;
};

export type ProjectOutcomeTypes = {
  outcomeId: string;
  outcomeStatement: string;
  impactStatement?: string;
  outcomeType: string;
  impactId: string;
  thematicAreas: string;
  responsiblePerson: string;
  projectId: string;
  resultTypeId: string;
};

export type ProjectOutputTypes = {
  outputId: string;
  outputStatement: string;
  outcomeId: string;
  outcomeStatement?: string;
  thematicAreas: string;
  responsiblePerson: string;
  projectId: string;
};

export interface DropdownOption {
  label: string;
  value: string;
}
