import { useState, useEffect, useCallback } from 'react';
import { CoinPrice, UserData, AlertData } from '../types';
import WebApp from '@twa-dev/sdk';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-telegram-init-data': WebApp.initData || '',
  };
}

export function usePrices() {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/crypto/prices`);
      const data = await res.json();
      setPrices(data.prices || []);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 120_000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, refetch: fetchPrices };
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/user/me`, { headers: getHeaders() });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }, []);

  const toggleFavorite = useCallback(async (coinId: string, isFav: boolean) => {
    const method = isFav ? 'DELETE' : 'POST';
    const res = await fetch(`${API_BASE}/user/favorites/${coinId}`, {
      method,
      headers: getHeaders(),
    });
    const data = await res.json();
    setUser(data);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, toggleFavorite };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts`, { headers: getHeaders() });
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, []);

  const createAlert = useCallback(async (coinId: string, targetPrice: number, direction: 'above' | 'below') => {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ coinId, targetPrice, direction }),
    });
    const data = await res.json();
    setAlerts((prev) => [data, ...prev]);
  }, []);

  const deleteAlert = useCallback(async (id: string) => {
    await fetch(`${API_BASE}/alerts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    setAlerts((prev) => prev.filter((a) => a._id !== id));
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, createAlert, deleteAlert };
}
