interface P {
    name: string;
    percent: number;
}

type PercentProps = {
    data: Array<P>
}

export default function Percentage({data}: PercentProps) {
    return data.map((p, i) => (
        <div key={i} className="w-full space-y-1.5 my-1.5">
          <div className="flex justify-between items-center text-[#7A7A7A] text-sm">
            <span>{p.name}</span>
            <span>{p.percent}%</span>
          </div>
          <div className="h-2 bg-[var(--primary)] rounded-lg" style={{ width: `${p.percent}%` }}></div>
        </div>
    ))
}