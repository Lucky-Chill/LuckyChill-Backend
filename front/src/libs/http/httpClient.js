/**
 * 공통 HTTP 클라이언트 — 백엔드 { success, data, error } 형식
 */
import { getAccessToken } from '../auth/session';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/**
 * @param {string} endpoint - /api/... 경로
 * @param {RequestInit} [options]
 * @returns {Promise<{ success: boolean, data: any, error: object|null }>}
 */
const httpClient = async (endpoint, options = {}) => {
  const token = await getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      body?.error?.message ??
      (response.status === 401
        ? '로그인이 필요합니다. 다시 로그인해 주세요.'
        : `HTTP ${response.status}: ${response.statusText}`);
    const err = new Error(message);
    err.status = response.status;
    err.code = body?.error?.code;
    throw err;
  }

  if (body && body.success === false) {
    const err = new Error(body.error?.message ?? '요청 실패');
    err.code = body.error?.code;
    throw err;
  }

  return body;
};

export default httpClient;
