"use client";

import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

/**
 * Legacy redirect: outcome/indicator/add
 * → /projects/[id]/project-management/indicator?resultType=outcome&resultId=[outcomeId]&mode=add
 */
export default function AddOutcomeIndicatorRedirect() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = (params?.id as string) || "";
  // Legacy URL passed outcomeId as a search param
  const outcomeId = searchParams.get("outcomeId") ?? "";

  useEffect(() => {
    router.replace(
      `/projects/${projectId}/project-management/indicator?resultType=outcome&resultId=${outcomeId}&mode=add`
    );
  }, [router, projectId, outcomeId]);

  return null;
}
