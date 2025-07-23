"use client";

import BarChartSingle from "@/ui/bar-chart-single";
import CardComponent from "@/ui/card-wrapper";

export default function DashboardGraph() {
    return (
        <CardComponent>
            <BarChartSingle
            data={[
                { label: "Apple", value: 80 },
                { label: "Banana", value: 90 },
                { label: "Cucumber", value: 80 },
                { label: "Dragon Fruit", value: 50 },
                { label: "Eggplant", value: 80 },
                { label: "Fresh Melon", value: 80 },
                { label: "Grapes", value: 90 },
                { label: "Project 8", value: 50 },
            ]}
            />
        </CardComponent>
    )
}