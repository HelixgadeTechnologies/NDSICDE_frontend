type TableProps<T> = {
  tableHead: Array<string>;
  tableData?: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
};

export default function Table<T>({
  tableHead,
  tableData = [],
  renderRow,
}: TableProps<T>) {
  return (
    <div className="w-full h-fit overflow-auto rounded-lg border border-[#E5E7EB]">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-[#F5F7FA] h-[52px] text-[#111928] text-sm font-medium">
            {tableHead.map((head, index) => (
              <th key={index} className="px-6 py-3">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr
              key={i}
              className="border-t border-[#E5E7EB] h-[60px] text-[#6B7280]"
            >
              {renderRow(row, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
