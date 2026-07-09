import { authService } from "./authService";

const getAuthHeaders = () => {
  const token = authService.getToken();
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const seatService = {
  getSeats: async (eventID: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/seats/getAll/${eventID}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load seats");
    }

    return response.json();
  },
  getMySeats: async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/seats/getAll/mySeats`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load seats");
    }

    return response.json();
  },
  lockASeat: async (seatId: string, eventId: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/seats/lockSeat/${seatId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ eventId }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to lock the seat !");
    }

    return response.json();
  },
  bookSeat: async (eventId: string, seatIds: string[]) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/seats/book`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ eventId, seatIds }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to book seats !");
    }

    return response.json();
  },
};
