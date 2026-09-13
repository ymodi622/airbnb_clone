import { useState, useEffect } from 'react';
import { api, type Listing, type Photo } from '../services/api';
import { fallbackListing } from '../data/fallbackListing';

export type PhotosByRoom = Record<string, Photo[]>;

export interface UseListingResult {
  listing: Listing | null;
  photos: Photo[];
  photosByRoom: PhotosByRoom;
  loading: boolean;
  error: string | null;
}

const ROOM_ORDER = [
  'Living room',
  'Kitchen',
  'Bedroom',
  'Bathroom',
  'Pool',
  'Gym',
  'Exterior',
  'Other',
];

export function useListing(id: number): UseListingResult {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getListing(id)
      .then((data) => {
        // ensure photos sorted by sort_order
        data.photos.sort((a, b) => a.sort_order - b.sort_order);
        setListing(data);
      })
      .catch((err: Error) => {
        console.warn('API Failed, using fallback listing:', err.message);
        setListing(fallbackListing);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const photos = listing?.photos ?? [];

  // Group photos by room_label, preserving ROOM_ORDER
  const photosByRoom: PhotosByRoom = {};
  for (const room of ROOM_ORDER) {
    const group = photos.filter((p) => p.room_label === room);
    if (group.length > 0) photosByRoom[room] = group;
  }
  // Any rooms not in ROOM_ORDER go last
  for (const p of photos) {
    if (!ROOM_ORDER.includes(p.room_label)) {
      photosByRoom[p.room_label] = photosByRoom[p.room_label] ?? [];
      if (!photosByRoom[p.room_label].includes(p)) {
        photosByRoom[p.room_label].push(p);
      }
    }
  }

  return { listing, photos, photosByRoom, loading, error };
}
