"use client";

import CardComponent from "@/ui/card";
import TabComponent from "@/components/tab-component";
import TableSection from "./table-section";
import ChartsComponent from "./charts";

export default function OrganizationalKPIComponent() {
    const tabs = [
        {tabName: "Charts", id: 1},
        {tabName: "Table", id: 2},
    ]
    return (
        <div className="space-y-5">
            <CardComponent>
                <TabComponent
                width="80"
                data={tabs}
                renderContent={((tabId) => {
                    if (tabId === 1) {
                        return <ChartsComponent/>;
                    } else {
                        return <TableSection/>;
                    }
                })}
                />
            </CardComponent>
            <CardComponent>alleged prapgh</CardComponent>
        </div>
    )
}