"use client";


import TabComponent from "@/components/tab-component";
import AccessControl from "@/components/settings/access-control";
import GeneralSettings from "@/components/settings/general-settings";

export default function SettingsComponent() {
    const tabs = [
        { tabName: "General Settings", id: 1 },
        { tabName: "Access Control", id: 2 },
    ];

      // for changing data through the parent or fetching data in children component
        // const handleTabChange = (tabId: number) => {
        //     console.log("Active tab is:", tabId);
        // };

  return (
    <section className="py-5">
      <TabComponent
        data={tabs}
        // onTabChange={handleTabChange}
        renderContent={(tabId) => {
          if (tabId === 1) {
            return <GeneralSettings/>;
          } else {
            return <AccessControl/>;
          }
        }}
      />
    </section>
  );
}
