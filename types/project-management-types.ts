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

// What you send to the API
export type ProjectRequestType = {
  requestId?: string; // optional on create, required on update
  staff: string;
  outputId: string;
  activityTitle: string;
  activityBudgetCode: number;
  activityLocation: string;
  activityPurposeDescription: string;
  activityStartDate: string;
  activityEndDate: string;
  budgetCode: number;
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
  isJourneyManagementRequired: boolean;
  lineItems: RequestLineItemType[];
  // conditional journey management fields
  purposeOfTrip?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  departureDate?: string;
  departureLocationAndTime?: string;
  destination?: string;
  contactPersonPhoneNumberAtDestination?: string;
  flightDepartureState?: string;
  flightDepartureTime?: string;
  flightArrivalState?: string;
  flightArrivalTime?: string;
  hotelAccommodationName?: string;
  hotelAddress?: string;
  returnDate?: string;
  returnTime?: string;
  airportDropoffOfficerName?: string;
  airportPickupOfficerName?: string;
  otherPersonnel?: {
    name: string;
    company: string;
    phoneNumber: string;
  }[];
};

// What the API sends back — extends the payload with server-generated fields
export type ProjectRequestResponseType = ProjectRequestType & {
  requestId: string; // always present in a response
  createdBy?: string;
  requestDate?: string;
  createAt?: string;
  project?: {
    projectName: string;
  };
  approvalStep?: number;
  approval_A?: null | string;
  approval_B?: null | string;
  approval_C?: null | string;
  approval_D?: null | string;
  approval_E?: null | string;
  approvedBy_A?: null | string;
  approvedBy_B?: null | string;
  approvedBy_C?: null | string;
  approvedBy_D?: null | string;
  approvedBy_E?: null | string;
  comment_A?: null | string;
  comment_B?: null | string;
  comment_C?: null | string;
  comment_D?: null | string;
  comment_E?: null | string;
};

export type RequestLineItemType = {
  // payload fields (required)
  description: string;
  quantity: number;
  frequency: number;
  unitCost: number;
  totalBudget: number;
  activityId: string;
  // server-response-only fields
  lineItemId?: string;
  requestId?: string;
  totalSpent?: number | null;
  variance?: number | null;
  createAt?: string;
  updateAt?: string;
};

export type ProjectActivityTypes = {
  activityId: string;
  activityStatement: string;
  outputId: string;
  outputStatement: string;
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
