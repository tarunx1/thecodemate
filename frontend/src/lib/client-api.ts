/** Same-origin admin writes; session and CSRF remain owned by FastAPI. */
function csrfToken() {
  return document.cookie.split('; ').find(value => value.startsWith('tc_admin_csrf='))?.split('=')[1] || '';
}

export async function adminPost<T>(path: string, body?: FormData): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { method: 'POST', headers: { 'x-csrf-token': csrfToken() }, body });
  } catch {
    throw new Error('The content service is unavailable. Check your connection and try again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || `The request failed (${response.status}).`);
  return data as T;
}
