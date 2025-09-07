export interface UserDetails {
  userId: string;
  fullName: string;
  email: string;
  address: string | null;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  status: "Active" | "Inactive" | "ACTIVE" | "INACTIVE";
  assignedProjectId: string | null;
  department: string | null;
  community: string | null;
  state: string | null;
  localGovernmentArea: string | null;
  profilePic: string | null;
  profilePicMimeType: string | null;
  loginLast: string;
  createAt: string;
  updateAt: string;
  password: string;
}

export const head = [
    "Full Name",
    "Email Address",
    "Role",
    "Status",
    "Last Active",
    "Department",
    "Actions",
  ];

  // export const data: UserDetails[] = [
  //   {
  //     id: 1,
  //     fullName: "John Doe",
  //     emailAddress: "john.doe@example.com",
  //     role: "Super Admin",
  //     status: "Inactive",
  //     lastActive: "May 15, 2023 10:30",
  //     assignedProjects: "Project A, Project B",
  //     phoneNumber: "09016789647",
  //     department: "Banking",
  //   },
  //   {
  //     id: 2,
  //     fullName: "Esther Chinda",
  //     emailAddress: "esther.chinda@example.com",
  //     role: "Admin",
  //     status: "Active",
  //     lastActive: "May 15, 2023 10:30",
  //     assignedProjects: "Project C, Project D",
  //     phoneNumber: "09016789647",
  //     department: "Agriculture",
  //   },
  //   {
  //     id: 3,
  //     fullName: "Godfrey Ayaosi",
  //     emailAddress: "godfrey.ayaosi@example.com",
  //     role: "Team Member",
  //     status: "Active",
  //     lastActive: "May 15, 2023 10:30",
  //     assignedProjects: "Project E, Project F",
  //     phoneNumber: "09016789647",
  //     department: "Finance",
  //   },
  // ];