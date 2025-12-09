export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("role-storage");
  return raw ? JSON.parse(raw).state.token : null;
}
