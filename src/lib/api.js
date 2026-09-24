/**
 * Single HTTP entry point for every Profilenc API call.
 *
 * Two layers, on purpose:
 *
 *   apiFetch(path, options) -> Response
 *     Thin wrapper. Prefixes the API base URL, attaches the bearer token and
 *     JSON headers. Use it when the caller inspects `res.ok` / `res.status`
 *     itself (404 vs 403 handling, optional endpoints, and so on).
 *
 *   apiJson(path, options) -> parsed body
 *     Parses the JSON body and throws `ApiError` when the response is not ok.
 *     Use it when the caller only cares about the happy path plus a message.
 */

export const API_BASE = import.meta.env.VITE_API_URL || '';

export const TOKEN_STORAGE_KEY = 'auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/** Absolute URL for an API path or a server-relative asset path. */
export function apiUrl(path = '') {
  return `${API_BASE}${path}`;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * @param {string} path            API path beginning with a slash.
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {any}    [options.body]  Plain object (sent as JSON), a pre-serialized
 *                                 JSON string, or FormData.
 * @param {string|null} [options.token]  Bearer token. Defaults to the stored
 *                                       token; pass `null` to send none.
 * @param {object} [options.headers]
 * @param {AbortSignal} [options.signal]
 */
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, token, headers = {}, signal } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const isRawBody = typeof body === 'string';
  const authToken = token === undefined ? getStoredToken() : token;

  const finalHeaders = { ...headers };
  if (body !== undefined && !isFormData && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (authToken && !finalHeaders.Authorization) {
    finalHeaders.Authorization = `Bearer ${authToken}`;
  }

  let finalBody;
  if (body === undefined) finalBody = undefined;
  else if (isFormData || isRawBody) finalBody = body;
  else finalBody = JSON.stringify(body);

  return fetch(apiUrl(path), {
    method,
    headers: finalHeaders,
    signal,
    body: finalBody,
  });
}

/**
 * Same options as `apiFetch`, plus:
 * @param {string} [options.errorMessage] Fallback message when the server
 *                                        response carries no `error` field.
 */
export async function apiJson(path, options = {}) {
  const { errorMessage = 'Request failed', ...fetchOptions } = options;
  const res = await apiFetch(path, fetchOptions);

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(data?.error || errorMessage, res.status, data);
  }

  return data;
}
