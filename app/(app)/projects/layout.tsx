"use client";

import BackButton from "@/ui/back-button";

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
        <BackButton header="Go Back"/>
        {children}
    </section>
  );
}
