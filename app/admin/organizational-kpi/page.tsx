import { Icon } from "@iconify/react";
import OrganizationalKPIComponent from "@/components/organizational-kpi/orgkpi-component";

export const metadata = {
  title: "Organizational KPI - NDSICDE",
  desrcription: "View your organization's  KPI dashboard",
};

export default function OrganizationalKPI() {
  const dashboardData = [
    {
        title: "Total Submissions",
        value: 24,
        percentage: 20.1,
        percentInfo: "from last month",
        icon: "proicons:graph",
    },
    {
        title: "Pending Review",
        value: 0,
        percentage: 0,
        percentInfo: "of total submissions",
        icon: "material-symbols:planner-review-rounded",
    },
    {
        title: "Approved",
        value: 7,
        percentage: 33,
        percentInfo: "approval rate",
        icon: "duo-icons:approved",
    },
    {
        title: "Rejected",
        value: 2,
        percentage: 23,
        percentInfo: "rejection rate",
        icon: "marketeq:rejected-file-2",
    },
];

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
        {dashboardData.map((d, i) => (
          <div
            key={i}
            className="h-[126px] w-full rounded-lg border border-[#E5E5E5] p-2 md:p-4 space-y-2.5"
          >
            <div className="flex justify-between items-center">
              <p className="text-xs md:text-sm font-medium leading-5 text-[#242424] whitespace-nowrap">
                {d.title}
              </p>
              <Icon icon={d.icon} height={20} width={20} color="#667185" />
            </div>
            <h4 className="primary font-bold leading-8 text-[22px]">
              {d.value}
            </h4>
            <p className="font-medium text-[10px] md:text-sm md:leading-5 space-x-1">
                <span className="text-[#22C55E]">+{d.percentage}%</span>
                <span className="text-[#7A7A7A]">{d.percentInfo}</span>
            </p>
          </div>
        ))}
      </div>
      <OrganizationalKPIComponent />
    </section>
  );
}
