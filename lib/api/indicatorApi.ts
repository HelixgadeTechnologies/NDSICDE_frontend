import axios from "axios";
import { IndicatorPayload } from "@/types/indicator";
import { getToken } from "./credentials";

export const indicatorApi = {
  createIndicator: async (payload: IndicatorPayload) => {
    // Fetch token fresh on every call — avoids stale token from module-load time
    const token = getToken();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response);

    return response.data;
  },

  updateIndicator: async (payload: IndicatorPayload) => {
    const token = getToken();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicator`,
      { ...payload, isCreate: false },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  },
};