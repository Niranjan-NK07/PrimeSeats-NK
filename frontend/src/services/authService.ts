import { buildApiUrl } from "./api";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch(buildApiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        // throw new Error("Registration failed !");
        throw new Error(error.message || "Registration failed !");
      }

      const result = await response.json();
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        if (result.username) {
          localStorage.setItem("authUsername", result.username);
          // localStorage.setItem("authEmail", result.email);
          localStorage.setItem("authID", result.authID);
        }
      }
      return result;
    } catch (err: any) {
      throw new Error(err.message || "Backend not reachable!");
    }
  },
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(buildApiUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      const result = await response.json();
      // console.log(result);
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        if (result.username) {
          localStorage.setItem("authUsername", result.username);
          // localStorage.setItem("authEmail", result.email);
          localStorage.setItem("authID", result.authID);
        }
      }
      return result;
    } catch (err: any) {
      // This catches "Failed to fetch" when backend is down
      throw new Error(err.message || "Backend not reachable!");
    }
  },
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authID");
  },
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },
  getUserID: (): string | null => {
    return localStorage.getItem("authID");
  },
  getUser: async (userId: string): Promise<any> => {
    const response = await fetch(buildApiUrl(`/auth/users/${userId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user");
    }
    const result = await response.json();
    return result;
  },
  getUsers: async (): Promise<any[]> => {
    const response = await fetch(buildApiUrl("/auth/users"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch users");
    }
    const result = await response.json();
    return result;
  },
  promoteOrDemote: async (userId: string, role: string): Promise<any> => {
    const response = await fetch(buildApiUrl(`/auth/users/${userId}/role`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to promote user to organizer");
    }
    const result = await response.json();
    return result;
  },
};
