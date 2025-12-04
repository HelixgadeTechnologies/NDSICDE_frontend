const raw = localStorage.getItem("role-storage");
export const token = raw ? JSON.parse(raw!).state.token : null;
