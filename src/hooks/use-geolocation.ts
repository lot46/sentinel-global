import { useCallback, useEffect, useState } from "react";

interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeolocationResult {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
  requestPosition: () => void;
}

/** Calculate distance between two points in meters (Haversine) */
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Blur position by ~50m for privacy */
export function blurPosition(pos: GeoPosition): GeoPosition {
  const offset = () => (Math.random() - 0.5) * 0.001;
  return {
    latitude: pos.latitude + offset(),
    longitude: pos.longitude + offset(),
    accuracy: Math.max(pos.accuracy, 50),
  };
}

export function useGeolocation(autoWatch = false): UseGeolocationResult {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    setPosition({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    });
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setError(
      err.code === 1 ? "Géolocalisation refusée par l'utilisateur."
      : err.code === 2 ? "Position indisponible."
      : "Délai de géolocalisation dépassé."
    );
    setLoading(false);
  }, []);

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée par ce navigateur.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
  }, [handleSuccess, handleError]);

  useEffect(() => {
    if (!autoWatch || !navigator.geolocation) return;
    setLoading(true);
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
    return () => navigator.geolocation.clearWatch(id);
  }, [autoWatch, handleSuccess, handleError]);

  return { position, error, loading, requestPosition };
}
