const BASE_URL = "http://localhost:3001";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const api = {
  get: async (url: string) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
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
      throw new Error("Network response was not ok");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  },
};

export default api;
