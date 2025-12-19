import axios from 'axios';

export interface StrategicObjective {
   createAt: string;
    linkedKpi: number;
    pillarLead: string;
    statement: string;
    status: string;
    strategicObjectiveId: string;
    thematicAreas: string;
    updateAt: string;
}

interface ApiResponse {
  data: StrategicObjective[];
}

export const getStrategicObjectives = async (): Promise<StrategicObjective[]> => {
  try {
    const res = await axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/strategic-objectives`
    );
    
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else {
      throw new Error("Invalid data format received from server");
    }
  } catch (error) {
    console.error("Error fetching strategic objectives:", error);
    throw error; // Re-throw so the caller can handle it
  }
};