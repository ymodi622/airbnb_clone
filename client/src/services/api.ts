export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';


export interface Photo {
  id: number;
  url: string;
  room_label: string;
  caption: string;
  sort_order: number;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  rating: number;
  review_count: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  photos: Photo[];
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  getListing: (id: number) => apiFetch<Listing>(`/api/listings/${id}`),
};
