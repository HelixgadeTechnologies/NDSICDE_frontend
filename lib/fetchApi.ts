export const fetchApi = {
  get: async (url: string, config?: any) => {
    const res = await fetch(url, { ...config, method: 'GET' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err: any = new Error(res.statusText);
      err.response = { data, status: res.status };
      throw err;
    }
    return { data, status: res.status };
  },
  post: async (url: string, body?: any, config?: any) => {
    const res = await fetch(url, { 
      ...config, 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', ...config?.headers },
      body: JSON.stringify(body) 
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err: any = new Error(res.statusText);
      err.response = { data, status: res.status };
      throw err;
    }
    return { data, status: res.status };
  },
  put: async (url: string, body?: any, config?: any) => {
    const res = await fetch(url, { 
      ...config, 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json', ...config?.headers },
      body: JSON.stringify(body) 
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err: any = new Error(res.statusText);
      err.response = { data, status: res.status };
      throw err;
    }
    return { data, status: res.status };
  },
  patch: async (url: string, body?: any, config?: any) => {
    const res = await fetch(url, { 
      ...config, 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json', ...config?.headers },
      body: JSON.stringify(body) 
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err: any = new Error(res.statusText);
      err.response = { data, status: res.status };
      throw err;
    }
    return { data, status: res.status };
  },
  delete: async (url: string, config?: any) => {
    const res = await fetch(url, { ...config, method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err: any = new Error(res.statusText);
      err.response = { data, status: res.status };
      throw err;
    }
    return { data, status: res.status };
  },
  isFetchError: (error: any) => {
    return error && error.response !== undefined;
  }
};

export default fetchApi;
