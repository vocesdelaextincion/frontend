const BASE_URL = "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
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
  post: async (url: string, data: Record<string, unknown>) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
  put: async (url: string, data: Record<string, unknown>) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
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

    return response.json();
  },
};

export default api;
