export interface RetirementRequest {
  id: number;
  activityLineDesc: string;
  quantity: number;
  frequency: number;
  unitCost: string;
  totalBudget: string;
  actualCost: string;
  status: string;
}

export const RetirementRequestHead = [
  "Activity Line Description",
  "Quantity",
  "Frequency",
  "Unit Cost(₦)",
  "Total Budget(₦)",
  "Actual Cost(₦)",
  "Status",
  "Actions",
];

export const RetirementRequestData: RetirementRequest[] = [
  {
    id: 1,
    activityLineDesc: "Community Health Initiative",
    quantity: 2,
    frequency: 3,
    unitCost: "30,000",
    totalBudget: "180,000",
    actualCost: "240,000",
    status: "Pending",
  },
  {
    id: 2,
    activityLineDesc: "Accomodation",
    quantity: 2,
    frequency: 3,
    unitCost: "30,000",
    totalBudget: "180,000",
    actualCost: "240,000",
    status: "Approved",
  },
  {
    id: 3,
    activityLineDesc: "Accomodation",
    quantity: 2,
    frequency: 3,
    unitCost: "30,000",
    totalBudget: "180,000",
    actualCost: "240,000",
    status: "Rejected",
  },
];

export type RequestRetirementType = {
  activityBudgetCode: number;
  activityEndDate: string;
  activityLineDescription: string;
  activityLocation: string;
  activityPurposeDescription: string;
  activityStartDate: string;
  activityTitle: string;
  approval_A: number;
  approval_B: number;
  approval_C: number;
  approval_D: number;
  approval_E: number;
  approvedBy_A: string;
  approvedBy_B: string;
  approvedBy_C: string;
  approvedBy_D: string;
  approvedBy_E: string;
  budgetCode: number;
  comment_A: string;
  comment_B: string;
  comment_C: string;
  comment_D: string;
  comment_E: string;
  createAt: string;
  departureTime: string;
  documentName: string;
  documentURL: string;
  driverName: string;
  driversPhoneNumber: string;
  frequency: number;
  modeOfTransport: string;
  outputId: string;
  project: string;
  projectId: string;
  quantity: number;
  recipientPhoneNumber: string;
  requestId: string;
  route: string;
  staff: string;
  status: string;
  total: number;
  unitCost: number;
  updateAt: string;
  vehicleColor: string;
  vehiclePlateNumber: string;
};
