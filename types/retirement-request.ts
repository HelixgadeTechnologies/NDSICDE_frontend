export interface RetirementRequest {
  id: number;
  activityLineDesc: string;
  quantity: number;
  frequency: number;
  unitCost: string;
  totalBudget: string;
  actualCost: string;
  status: string;
};

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
