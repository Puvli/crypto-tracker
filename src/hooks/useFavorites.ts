import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'crypto_favorites';

function getKey(uid?: string) {
  return uid ? `${STORAGE_KEY}_${uid}` : STORAGE_KEY;
}

function loadFavorites(uid?: string): string[] {
  try {
    const data = localStorage.getItem(getKey(uid));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favs: string[], uid?: string) {
  localStorage.setItem(getKey(uid), JSON.stringify(favs));
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites(user?.uid));

  useEffect(() => {
    setFavorites(loadFavorites(user?.uid));
  }, [user]);

  const toggle = useCallback(
    (coinId: string) => {
      setFavorites((prev) => {
        const next = prev.includes(coinId)
          ? prev.filter((id) => id !== coinId)
          : [...prev, coinId];
        saveFavorites(next, user?.uid);
        return next;
      });
    },
    [user]
  );

  const isFavorite = useCallback(
    (coinId: string) => favorites.includes(coinId),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
