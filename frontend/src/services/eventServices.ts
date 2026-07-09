import { authService } from "./authService";

export interface CreateEvent {
  title: string;
  description: string;
  venue: string;
  dateTime: Date;
  organizerId: string | null;
  category: string;
  status: string;
  totalSeats: number;
}

export interface SearchEventsParams {
  searchValue: string;
  category: string;
  location: string;
}

const getAuthHeaders = () => {
  const token = authService.getToken();
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const eventService = {
  getEvents: async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/events/getAll`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load events");
    }

    return response.json();
  },
  getEvent: async (evntId: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/events/${evntId}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load events");
    }

    return response.json();
  },
  createEvent: async (eventData: CreateEvent) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/events/create`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(eventData),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create event!");
    }

    return response.json();
  },
  searchEvents: async (params: SearchEventsParams) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/events/search?query=${encodeURIComponent(params.searchValue)}&category=${encodeURIComponent(params.category)}&location=${encodeURIComponent(params.location)}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to search events");
    }

    return response.json();
  },
};
