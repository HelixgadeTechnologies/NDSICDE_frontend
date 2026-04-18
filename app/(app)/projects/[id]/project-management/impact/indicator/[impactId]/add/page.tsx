"use client";

import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

/**
 * Legacy redirect: impact/indicator/[impactId]/add
 * → /projects/[id]/project-management/indicator?resultType=impact&resultId=[impactId]&mode=add
 */
export default function AddImpactIndicatorRedirect() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = (params?.id as string) || "";
  const impactId = (params?.impactId as string) || "";
  // Preserve any extra search params that may have been passed
  const extra = searchParams.toString()
    ? `&${searchParams.toString()}`
    : "";

  useEffect(() => {
    router.replace(
      `/projects/${projectId}/project-management/indicator?resultType=impact&resultId=${impactId}&mode=add${extra}`
    );
  }, [router, projectId, impactId, extra]);

  return null;
}
