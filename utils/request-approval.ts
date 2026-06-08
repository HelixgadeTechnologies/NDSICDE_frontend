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
//
// Special rule: Level 2 = Security Officer. This layer is ONLY required when
// `isJourneyManagementRequired` is true on the request. When it is false, layer
// 2 is skipped and the chain jumps directly from layer 1 to layer 3.

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

/** Whether journey management is required on this request (defaults to true if absent). */
const isJourneyRequired = (req: ApprovalRecord): boolean => {
  const val = req.isJourneyManagementRequired;
  // Treat undefined / null as true (safe default)
  if (val === undefined || val === null) return true;
  return Boolean(val);
};

/**
 * The layer (1-5) currently awaiting action, derived from the per-layer fields.
 * Returns null when every layer has been approved.
 *
 * Layer 2 (Security Officer) is skipped entirely when journey management is not
 * required — so the chain goes 1 → 3 → 4 → 5 in that case.
 */
export function getCurrentApprovalLayer(req: ApprovalRecord): number | null {
  const journeyRequired = isJourneyRequired(req);
  for (let i = 0; i < STATUS_KEYS.length; i++) {
    const layer = i + 1; // layers are 1-indexed
    // Skip layer 2 (Security Officer) when journey management is not required
    if (layer === 2 && !journeyRequired) continue;
    if (!isLayerApproved(req, i)) return layer;
  }
  return null; // all applicable layers approved
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
 *
 * A level-2 user (Security Officer) can never act when journey management is
 * not required, even if it's technically "their turn" in the index.
 */
export function canUserApprove(
  req: ApprovalRecord,
  level?: number | null,
): boolean {
  if (typeof level !== "number" || level < 1) return false;
  if (getApprovalState(req) !== "in-progress") return false;
  // Security Officer (level 2) is excluded when journey management is not required
  if (level === 2 && !isJourneyRequired(req)) return false;
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

  // Level 2 (Security Officer) is not part of this chain
  if (level === 2 && !isJourneyRequired(req)) {
    return "Security Officer approval is not required — journey management was not requested.";
  }

  const current = getCurrentApprovalLayer(req);
  if (typeof level === "number" && current !== null && current > level) {
    return "Your layer has already approved this request.";
  }
  return current !== null
    ? `This request is awaiting approval at Layer ${current}.`
    : "This request has been fully approved.";
}
