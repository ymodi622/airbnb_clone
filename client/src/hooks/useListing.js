import { useState, useEffect } from 'react';
import { api } from '../services/api';

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

export function useListing(id) {
  const [listing, setListing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getListing(id)
      .then((data) => {
        // API returns { listing, photos, amenities }
        const sortedPhotos = (data.photos ?? []).sort(
          (a, b) => a.sort_order - b.sort_order
        );
        setListing(data.listing ?? data);
        setPhotos(sortedPhotos);
      })
      .catch((err) => {
        console.error('Failed to load listing:', err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Group photos by room_label, preserving ROOM_ORDER
  const photosByRoom = {};
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
