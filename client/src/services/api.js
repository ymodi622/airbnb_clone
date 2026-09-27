export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const api = {
  getListing: (id) => apiFetch(`/api/listings/${id}`),
};

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}
