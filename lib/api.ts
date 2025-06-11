import api from "./axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Types
export interface ApiResponse<T = any> {
  data: T;
  error?: string;
}

// Helper function to handle API calls
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem("adminToken");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null as T,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post<{ message: string; token: string }>(
        "/api/admin/login",
        {
          username,
          password,
        }
      );
      return { data: response.data };
    } catch (error: any) {
      if (error.response?.data?.message) {
        return { data: null, error: error.response.data.message };
      }
      return {
        data: null,
        error: error.message || "An error occurred during login",
      };
    }
  },
  logout: async () => {
    try {
      await api.post("/api/admin/logout");
      return { data: { message: "Logged out successfully" } };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Exams API
export const examsApi = {
  getAll: async () => {
    try {
      const response = await api.get("/api/exams");
      console.log("[EXAMS API] getAll", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  create: async (examData: any) => {
    try {
      const response = await api.post("/api/exams", examData);
      console.log("[EXAMS API] create", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  update: async (id: string, examData: any) => {
    try {
      const response = await api.put(`/api/exams/${id}`, examData);
      console.log("[EXAMS API] update", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/api/exams/${id}`);
      console.log("[EXAMS API] delete", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Scholarships API
export const scholarshipsApi = {
  getAll: async () => {
    try {
      const response = await api.get("/api/scholarships");
      console.log("[SCHOLARSHIPS API] getAll", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  create: async (scholarshipData: any) => {
    try {
      const response = await api.post("/api/scholarships", scholarshipData);
      console.log("[SCHOLARSHIPS API] create", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  update: async (id: string, scholarshipData: any) => {
    try {
      const response = await api.put(`/api/scholarships/${id}`, scholarshipData);
      console.log("[SCHOLARSHIPS API] update", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/api/scholarships/${id}`);
      console.log("[SCHOLARSHIPS API] delete", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Guides API
export const guidesApi = {
  getAll: async () => {
    try {
      const response = await api.get("/api/guides");
      console.log("[GUIDES API] getAll", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  create: async (guideData: any) => {
    try {
      const response = await api.post("/api/guides", guideData);
      console.log("[GUIDES API] create", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  update: async (id: string, guideData: any) => {
    try {
      const response = await api.put(`/api/guides/${id}`, guideData);
      console.log("[GUIDES API] update", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/api/guides/${id}`);
      console.log("[GUIDES API] delete", response.data);
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Dashboard API
export const dashboardApi = {
  getOverview: async () => {
    try {
      const response = await api.get("/api/admin/dashboard");
      return { data: response.data };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};
