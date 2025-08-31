const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class AuthorizationError extends Error {
  constructor(message: string = "Not authorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const api = {
  get: async (url: string, params?: Record<string, string | number>) => {
    let fullUrl = `${BASE_URL}${url}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      if (searchParams.toString()) {
        fullUrl += `?${searchParams.toString()}`;
      }
    }
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthorizationError();
      }
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
  post: async (url: string, data: Record<string, unknown> | FormData) => {
    const authHeaders = getAuthHeaders();
    let headers: HeadersInit = authHeaders;
    let body: BodyInit;

    if (data instanceof FormData) {
      const restHeaders: { [key: string]: string } = { ...authHeaders };
      delete restHeaders["Content-Type"];
      headers = restHeaders;
      body = data;
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthorizationError();
      }
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
  put: async (url: string, data: Record<string, unknown> | FormData) => {
    const authHeaders = getAuthHeaders();
    let headers: HeadersInit = authHeaders;
    let body: BodyInit;

    if (data instanceof FormData) {
      const restHeaders: { [key: string]: string } = { ...authHeaders };
      delete restHeaders["Content-Type"];
      headers = restHeaders;
      body = data;
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers,
      body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthorizationError();
      }
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
  delete: async (url: string) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthorizationError();
      }
      throw new Error("Network response was not ok");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  },
};

export default api;
