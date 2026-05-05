import { createClient } from "@/src/utils/supabase/client";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || result.error || `API error: ${response.status}`);
  }

  return result.data !== undefined ? result.data : result;
}
