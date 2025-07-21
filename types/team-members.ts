export interface UserDetails {
  id: number;
  fullName: string;
  emailAddress: string;
  role: string;
  status: "Active" | "Inactive";
  lastActive: string;
  assignedProjects: string;
  phoneNumber: string;
  department: string;
}

export const head = [
    "Full Name",
    "Email Address",
    "Role",
    "Status",
    "Last Active",
    "Assigned Projects",
    "Actions",
  ];

  export const data: UserDetails[] = [
    {
      id: 1,
      fullName: "John Doe",
      emailAddress: "john.doe@example.com",
      role: "Super Admin",
      status: "Inactive",
      lastActive: "May 15, 2023 10:30",
      assignedProjects: "Project A, Project B",
      phoneNumber: "09016789647",
      department: "Banking",
    },
    {
      id: 2,
      fullName: "Esther Chinda",
      emailAddress: "esther.chinda@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "May 15, 2023 10:30",
      assignedProjects: "Project C, Project D",
      phoneNumber: "09016789647",
      department: "Agriculture",
    },
    {
      id: 3,
      fullName: "Godfrey Ayaosi",
      emailAddress: "godfrey.ayaosi@example.com",
      role: "Team Member",
      status: "Active",
      lastActive: "May 15, 2023 10:30",
      assignedProjects: "Project E, Project F",
      phoneNumber: "09016789647",
      department: "Finance",
    },
  ];