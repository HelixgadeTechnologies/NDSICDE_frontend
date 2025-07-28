import BackButton from "@/ui/back-button";
import Recents from "./recent-tabs-component";

export const metadata = {
  title: "Recent Activities | Dashboard - NDSICDE",
  description: "Monitor your recent activities from the dashboard",
}

export default function RecentActivities() {

  return (
    <>
      <BackButton/>
      <Recents/>
    </>
  );
}
