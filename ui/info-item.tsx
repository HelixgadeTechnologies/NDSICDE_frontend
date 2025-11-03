export default function InfoItem({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {icon && <span className="text-[#D2091E]">{icon}</span>}
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
