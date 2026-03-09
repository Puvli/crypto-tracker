import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'crypto_favorites';

function loadFavorites(uid: string): string[] {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveFavorites(uid: string, favs: string[]) {
  localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(favs));
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setFavorites(loadFavorites(user.uid));
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggle = useCallback(
    (coinId: string) => {
      if (!user) return;
      setFavorites((prev) => {
        const next = prev.includes(coinId)
          ? prev.filter((id) => id !== coinId)
          : [...prev, coinId];
        saveFavorites(user.uid, next);
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
