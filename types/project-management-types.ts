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
  name: string;
  email: string;
  role: string;
  lastActive: string;
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
  status: string;};

export type ProjectActivityTypes = {
  userId: string;
  activityStatement: string;
  output: string;
  budget: string;
  startDate: string;
  endDate: string;
  responsiblePersons: string;
};

export type ProjectOutcomeTypes = {
  userId: string;
  projectOutcome: string;
  outcomeType: string;
  impact: string;
  thematicAreas: string;
  responsiblePerson: string;
};

export type ProjectOutputTypes = {
  userId: string;
  impactStatement: string;
  outcome: string;
  thematicAreas: string;
  responsiblePerson: string;
};

export interface DropdownOption {
  label: string;
  value: string;
}
