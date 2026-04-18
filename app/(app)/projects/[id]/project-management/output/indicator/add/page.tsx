"use client";

import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

/**
 * Legacy redirect: output/indicator/add
 * → /projects/[id]/project-management/indicator?resultType=output&resultId=[outputId]&mode=add
 */
export default function AddOutputIndicatorRedirect() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = (params?.id as string) || "";
  // Legacy URL passed outputId as a search param
  const outputId = searchParams.get("outputId") ?? "";

  useEffect(() => {
    router.replace(
      `/projects/${projectId}/project-management/indicator?resultType=output&resultId=${outputId}&mode=add`
    );
  }, [router, projectId, outputId]);

  return null;
}
