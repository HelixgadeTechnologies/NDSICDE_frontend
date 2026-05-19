export function sortByCreatedAt<T extends { createAt?: string }>(arr: T[]): T[] {
  return [...arr].sort(
    (a, b) =>
      new Date(a.createAt || 0).getTime() - new Date(b.createAt || 0).getTime(),
  );
}

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

export const toSentenceCase = (str: string, maxLength: number = 50) => {
  if (!str) return "";
  let truncatedStr = str;
  if (str.length > maxLength) {
    truncatedStr = str.substring(0, maxLength) + "...";
  }
  return truncatedStr
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());
};
