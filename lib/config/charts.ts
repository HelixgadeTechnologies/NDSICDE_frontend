// all fake data

// KPI VS actual target
export const KPIActualTarget = [
  {
    name: "Quarter 1",
    target: 110,
    actual: 190,
  },
  {
    name: "Quarter 2",
    target: 60,
    actual: 120,
  },
  {
    name: "Quarter 3",
    target: 75,
    actual: 18,
  },
  {
    name: "Quarter 4",
    target: 40,
    actual: 20,
  },
];

export const PDSColors = ["#22C55E", "#EF4444", "#003B99"];
export const projectDistributionStatus = [
  { name: "On Track", value: 33 },
  { name: "Delays", value: 14 },
  { name: "At Risk", value: 27 },
];

export const kPIOverview = [
  {
    name: "EDU 01",
    baseline: 68,
    target: 95,
    actual: 50,
  },
  {
    name: "EDU 02",
    baseline: 45,
    target: 70,
    actual: 17,
  },
  {
    name: "HEALTH 01",
    baseline: 44,
    target: 70,
    actual: 27,
  },
  {
    name: "HEALTH 02",
    baseline: 44,
    target: 70,
    actual: 25,
  },
  {
    name: "INFRA 01",
    baseline: 60,
    target: 20,
    actual: 30,
  },
  {
    name: "INFRA 02",
    baseline: 35,
    target: 25,
    actual: 28,
  },
];

export const KPIProgressTracking = [
  {
    title: "Activity",
    percentages: [
      { name: "Meetings", percent: 92 },
      { name: "Tasks", percent: 87 },
    ],
  },
  {
    title: "Output",
    percentages: [
      { name: "Deliverables", percent: 42 },
      { name: "Milestones", percent: 30 },
    ],
  },
  {
    title: "Outcomes",
    percentages: [
      { name: "Objectives", percent: 14 },
      { name: "KPIs", percent: 94 },
    ],
  },
  {
    title: "Impact",
    percentages: [
      { name: "Strategic Goals", percent: 75 },
      { name: "Business Value", percent: 42 },
    ],
  },
];

export const budgetVSActualSpending = [
  {
    name: "Quarter 1",
    budget: 110,
    actual: 190,
  },
  {
    name: "Quarter 2",
    budget: 60,
    actual: 120,
  },
  {
    name: "Quarter 3",
    budget: 75,
    actual: 18,
  },
  {
    name: "Quarter 4",
    budget: 40,
    actual: 20,
  },
];

export const ECBColors = [
  "#22C55E",
  "#EF4444",
  "#EAB308",
  "#98A2B3",
  "#003B99",
];
export const expenseCategoriesBreakdown = [
  { name: "Personnel", value: 33 },
  { name: "Equipment", value: 27 },
  { name: "Services", value: 14 },
  { name: "Travel", value: 14 },
  { name: "Other", value: 14 },
];

// export const recentActivities = [
//   {
//     id: 1,
//     activity: "submitted a new report",
//     project: "Water Sanitation",
//     time: "2 hours ago",
//     name: "John Doe",
//     role: "Project Manager",
//     status: "Success",
//   },
//   {
//     id: 2,
//     activity: "updated KPI targets",
//     project: "Food Security",
//     time: "5 hours ago",
//     name: "Alice Smith",
//     role: "Project Manager",
//     status: "Pending",
//   },
//   {
//     id: 3,
//     activity: "approved the financial request",
//     project: "Infrastructure Development",
//     time: "5 hours ago",
//     name: "Micheal Brown",
//     role: "Project Manager",
//     status: "Success",
//   },
//   {
//     id: 4,
//     activity: "added a new team member",
//     project: "Health Outreach",
//     time: "1 day ago",
//     name: "Emily Johnson",
//     role: "Project Manager",
//     status: "Failed",
//   },
//   {
//     id: 5,
//     activity: "completed the project review",
//     project: "Community Engagement",
//     time: "2 days ago",
//     name: "David Wilson",
//     role: "Project Manager",
//     status: "Success",
//   },
//   {
//     id: 6,
//     activity: "submitted a new proposal",
//     project: "Education Initiative",
//     time: "3 days ago",
//     name: "Sarah Davis",
//     role: "Project Manager",
//     status: "Pending",
//   },
// ];

export interface Activity {
  id: string | number;
  name: string;
  activity: string;
  project: string;
  time: string;
  role?: string;
  status?: "Success" | "Pending"
}
export const recentActivities: Activity[] = [];

export const pendingActivityFundRequest = [
  {
    id: 1,
    title: "Fund Request for Water Project",
    project: "Water Sanitation",
    status: "Urgent",
    type: "Project",
  },
  {
    id: 2,
    title: "Financial Request for Health Initiative",
    project: "Health Outreach",
    status: "Normal",
    type: "Team",
  },
  {
    id: 3,
    title: "Budget Approval for Education Program",
    project: "Education Initiative",
    status: "Normal",
    type: "Project",
  },
  { id: 4,
    title: "Funding Request for Infrastructure Development",
    project: "Infrastructure Development",
    status: "Urgent",
    type: "Project",
  },
];

export const pendingReportApproval = [
  {
    id: 1,
    title: "Activity",
    project: "Education Initiative",
    status: "Urgent",
    type: "Project",
  },
  {
    id: 2,
    title: "Output",
    project: "Field Operations",
    status: "Normal",
    type: "Team",
  },
  {
    id: 3,
    title: "Outcome",
    project: "Water Sanitation",
    status: "Normal",
    type: "Project",
  },
  {
    id: 4,
    title: "Impact",
    project: "Food Security",
    status: "Urgent",
    type: "Project",
  },
];

export const progressTrackingColors = [
  "#22C55E",
  "#EF4444",
  "#003B99",
];
export const progressTracking = [
  { name: "Outputs", value: 53 },
  { name: "Outcomes", value: 37 },
  { name: "Impact", value: 20 },
];

export const comments = [
  {
    id: 1,
    name: "John Doe",
    date: "Mar 15, 2025",
    time: "10:20 PM",
    comment: "The marketing campaign exceeded our expectations in terms of reach, but we need to improve conversion rates in the next quarter.",
  },
  {
    id: 2,
    name: "John Doe",
    date: "Mar 15, 2025",
    time: "10:20 PM",
    comment: "The marketing campaign exceeded our expectations in terms of reach, but we need to improve conversion rates in the next quarter.",
  },
];