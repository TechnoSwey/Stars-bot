/**
 * API-клиент для мини-приложения.
 * Базовый URL берётся из VITE_API_BASE_URL (задаётся в GitHub Actions или .env.local).
 * По умолчанию — http://localhost:8080 (для локальной разработки).
 */

const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────

export interface AuthResult {
  user_id: number;
  first_name: string;
  stars: number;
}

export interface MiniAppProfile {
  user_id: number;
  first_name: string;
  stars: number;
  completed_tasks_count: number;
  total_earned: number;
}

export interface MiniAppTask {
  id: number;
  channel_link: string;
  stars_reward: number;
  already_completed: boolean;
}

export interface VerifyResult {
  success: boolean;
  stars_earned?: number;
  message?: string;
}

export interface TaskRequest {
  id: number;
  channel_link: string;
  completions_total: number;
  completions_done: number;
  price_per_completion: number;
  status: string;
}

export interface PlatformStats {
  total_users: number;
  total_paid: number;
  stars_per_subscription: number;
  active_tasks_count: number;
}

// ── API calls ─────────────────────────────────────────────

export const api = {
  auth: (data: { user_id: number; first_name: string; username?: string }) =>
    apiFetch<AuthResult>('/api/miniapp/auth', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (user_id: number) =>
    apiFetch<MiniAppProfile>(`/api/miniapp/profile?user_id=${user_id}`),

  getTasks: (user_id: number) =>
    apiFetch<MiniAppTask[]>(`/api/miniapp/tasks?user_id=${user_id}`),

  verifyTask: (task_id: number, user_id: number) =>
    apiFetch<VerifyResult>(`/api/miniapp/tasks/${task_id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ user_id }),
    }),

  getRequests: (user_id: number) =>
    apiFetch<TaskRequest[]>(`/api/miniapp/requests?user_id=${user_id}`),

  createRequest: (data: {
    user_id: number;
    channel_link: string;
    completions_total: number;
    price_per_completion: number;
  }) =>
    apiFetch<{ id: number; status: string }>('/api/miniapp/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStats: () =>
    apiFetch<PlatformStats>('/api/miniapp/stats'),
};
