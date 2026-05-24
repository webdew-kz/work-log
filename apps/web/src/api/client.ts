const API_BASE = import.meta.env.VITE_API_URL || "";
const API_TIMEOUT = 30000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}/api${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timer);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(
        body.message || `HTTP ${res.status}`,
        res.status,
        body,
      );
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  } catch (e: any) {
    clearTimeout(timer);
    if (e.name === "AbortError") {
      throw new ApiError("Превышено время ожидания ответа сервера");
    }
    throw e;
  }
}

export const workTypesApi = {
  list: () => api<WorkType[]>("/work-types"),
  create: (data: CreateWorkTypeDto) =>
    api<WorkType>("/work-types", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: UpdateWorkTypeDto) =>
    api<WorkType>(`/work-types/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) =>
    api<void>(`/work-types/${id}`, { method: "DELETE" }),
};

export const workLogsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return api<WorkLog[]>(`/work-logs${qs}`);
  },
  create: (data: CreateWorkLogDto) =>
    api<WorkLog>("/work-logs", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: UpdateWorkLogDto) =>
    api<WorkLog>(`/work-logs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) =>
    api<void>(`/work-logs/${id}`, { method: "DELETE" }),
};

export interface WorkType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLog {
  id: string;
  date: string;
  volume: string;
  executor: string;
  workTypeId: string;
  workType: WorkType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkTypeDto {
  name: string;
}

export interface UpdateWorkTypeDto {
  name: string;
}

export interface CreateWorkLogDto {
  date: string;
  workTypeId: string;
  volume: string;
  executor: string;
}

export interface UpdateWorkLogDto {
  date: string;
  workTypeId: string;
  volume: string;
  executor: string;
}