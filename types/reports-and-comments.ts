export interface ReportsDetails {
  reportId: string;
  reportTitle: string,
  project: string,
  dateGenerated: string,
  status: string,
  kpiStatus: string,
}

export const reportsHead = [
    "Report Title",
    "Project",
    "Date Generated",
    "Status",
    "KPI Status",
    "Actions",
  ];

  // export const reportsData: ReportsDetails[] = [
  //   {
  //     id: 1,
  //     reportTitle: "Q1 Marketing Performance",
  //     project: "Marketing Campaign 2023",
  //     dateGenerated: "Jan 15, 2023",
  //     status: "Approved",
  //     kpiStatus: "Met",
  //   },
  //   {
  //     id: 2,
  //     reportTitle: "Q1 Marketing Performance",
  //     project: "Marketing Campaign 2023",
  //     dateGenerated: "Jan 15, 2023",
  //     status: "Pending",
  //     kpiStatus: "Not Met",
  //   },
  //   {
  //     id: 3,
  //     reportTitle: "Q1 Marketing Performance",
  //     project: "Marketing Campaign 2023",
  //     dateGenerated: "Jan 15, 2023",
  //     status: "Not Approved",
  //     kpiStatus: "Not Met",
  //   },
  // ];