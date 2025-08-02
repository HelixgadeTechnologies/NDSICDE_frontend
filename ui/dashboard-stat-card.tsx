import { Icon } from "@iconify/react";

interface StatType {
    title: string;
    icon?: string;
    value: number | string;
    percentage?: number;
    percentInfo?: string;}

type StatProps = {
    data: Array<StatType>
    icon?: string;
    bigger?: boolean;
}

export default function DashboardStat({ data, icon, bigger }: StatProps) {
    return data.map((d, index) => (
        <div key={index} className={`${bigger ? 'h-[158px]' : 'h-[126px]'} w-full rounded-lg border border-[#E5E5E5] p-2 md:p-4 space-y-2.5`}>
            <div className="flex justify-between items-center">
              <p className="text-xs md:text-[13px] font-medium leading-5 text-[#242424] whitespace-nowrap capitalize">
                {d.title}
              </p>
              {d.icon && <Icon icon={d.icon} height={20} width={20} color="#667185" />}
            </div>
            <h4 className="primary font-bold leading-8 text-[22px]">
              {d.value}
            </h4>
            <p className="font-medium text-[10px] md:text-sm md:leading-5 space-x-1 flex items-center">
                {d.percentage && <span className={`${d.percentage >= 0 ? "text-[#22C55E]" : "text-red-500"} flex items-center`}>
                  {icon && <Icon icon={icon} width={20} height={20} />}
                  {d.percentage}%
                </span>}
                <span className="text-[#7A7A7A]">{d.percentInfo}</span>
            </p>
        </div>
    ))
}