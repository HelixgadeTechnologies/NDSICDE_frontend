import axios from "axios";

export type ResultType = {
  resultTypeId: string;
  resultName: string;
};

export type ResultTypeResponse = {
  data: ResultType[];
  message?: string;
};

/**
 * Fetch all result types
 * @returns Promise with result types data
 */
export const fetchResultTypes = async (): Promise<ResultType[]> => {
  // const token = getToken();
  
  try {
    const response = await axios.get<ResultTypeResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/result_types`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    );

    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching result types:", error);
    throw error;
  }
};

/**
 * Get a single result type by ID
 * @param resultTypeId - The ID of the result type
 * @returns Promise with result type data
 */
export const getResultTypeById = async (
  resultTypeId: string
): Promise<ResultType | null> => {
  try {
    const resultTypes = await fetchResultTypes();
    return resultTypes.find((type) => type.resultTypeId === resultTypeId) || null;
  } catch (error) {
    console.error("Error getting result type by ID:", error);
    return null;
  }
};

/**
 * Transform result types to dropdown options format
 * @param resultTypes - Array of result types
 * @returns Array of dropdown options
 */
export const transformResultTypesToOptions = (resultTypes: ResultType[]) => {
  return resultTypes.map((type) => ({
    label: type.resultName,
    value: type.resultTypeId,
  }));
};