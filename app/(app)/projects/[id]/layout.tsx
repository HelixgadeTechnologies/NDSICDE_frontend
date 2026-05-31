"use client";

import { useParams } from "next/navigation";
import { ProjectTeamProvider } from "@/context/ProjectTeamContext";

export default function ProjectIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const projectId = (params?.id as string) || "";

  return <ProjectTeamProvider projectId={projectId}>{children}</ProjectTeamProvider>;
}
