export const typeChecker = (row: { status: string }) => {
    if (row.status === "On Track") {
      return "text-yellow-500 px-6";
    } else if (row.status === "Over Budget") {
      return "text-red-500 px-6";
    } else {
      return "text-green-500 px-6";
    }
  };

  export const managementTypeChecker = (row: { status: string }) => {
    if (row.status === "On Hold") {
      return "text-yellow-500 px-6";
    } else if (row.status === "Completed") {
      return "text-[#003B99] px-6";
    } else {
      return "text-green-500 px-6";
    }
  };
