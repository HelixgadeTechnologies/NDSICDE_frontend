"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import CardComponent from "@/ui/card-wrapper";

export default function ViewKPIDetails({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    const fetchKPI = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/report/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching KPI details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchKPI();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="dots my-20 mx-auto">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  if (!data) {
    return <p className="text-red-500">Failed to load KPI details.</p>;
  }

  return (
    <CardComponent>
      <div className="space-y-4">
        {/* The user requested to only ensure it's connected and they will fix UI */}
        <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </CardComponent>
  );
}
