// Helpers for reasoning about the multi-layer request/retirement approval chain.
//
// Per-layer progress (which layers have acted) lives in:
//   approval_A..E   : 1 = Approved at that layer
//   approvedBy_A..E : user id of whoever acted at that layer
//
// The overall outcome lives in the top-level `approvalStep`, which stays 1 while
// the chain is in progress and only changes to signal a terminal/paused state:
//   approvalStep : 2 = Rejected, 3 = Under Review
//
// A user at level N may act only when it's their layer's turn — i.e. every layer
// before N is approved and layer N itself hasn't been approved yet.

const STATUS_KEYS = [
  "approval_A",
  "approval_B",
  "approval_C",
  "approval_D",
  "approval_E",
] as const;

const APPROVED_BY_KEYS = [
  "approvedBy_A",
  "approvedBy_B",
  "approvedBy_C",
  "approvedBy_D",
  "approvedBy_E",
] as const;

export type ApprovalState = "in-progress" | "approved" | "rejected" | "under-review";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApprovalRecord = Record<string, any>;

const toCode = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

const isLayerApproved = (req: ApprovalRecord, index: number): boolean => {
  const code = toCode(req[STATUS_KEYS[index]]);
  // Prefer the explicit status; fall back to "someone acted" if status is absent.
  return code === 1 || (code === null && !!req[APPROVED_BY_KEYS[index]]);
};

/**
 * The layer (1-5) currently awaiting action, derived from the per-layer fields.
 * Returns null when every layer has been approved.
 */
export function getCurrentApprovalLayer(req: ApprovalRecord): number | null {
  for (let i = 0; i < STATUS_KEYS.length; i++) {
    if (!isLayerApproved(req, i)) return i + 1;
  }
  return null; // all five layers approved
}

/** Overall chain state. Rejected/under-review (from approvalStep) take precedence. */
export function getApprovalState(req: ApprovalRecord): ApprovalState {
  const step = toCode(req.approvalStep);
  if (step === 2) return "rejected";
  if (step === 3) return "under-review";
  return getCurrentApprovalLayer(req) === null ? "approved" : "in-progress";
}

/**
 * Whether the logged-in user (by their approval `level`) may act on this item
 * right now — the chain is still in progress and it's their layer's turn.
 */
export function canUserApprove(
  req: ApprovalRecord,
  level?: number | null,
): boolean {
  if (typeof level !== "number" || level < 1) return false;
  if (getApprovalState(req) !== "in-progress") return false;
  return getCurrentApprovalLayer(req) === level;
}

/** Human-readable reason the action area is hidden, for the current user. */
export function getApprovalStatusMessage(
  req: ApprovalRecord,
  level?: number | null,
): string {
  const state = getApprovalState(req);
  if (state === "approved") return "This request has been fully approved.";
  if (state === "rejected") return "This request has been rejected.";
  if (state === "under-review") return "This request is under review.";

  const current = getCurrentApprovalLayer(req);
  if (typeof level === "number" && current !== null && current > level) {
    return "Your layer has already approved this request.";
  }
  return current !== null
    ? `This request is awaiting approval at Layer ${current}.`
    : "This request has been fully approved.";
}
