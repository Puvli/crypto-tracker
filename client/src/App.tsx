import { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { usePrices, useUser, useAlerts } from './hooks/useApi';
import { CoinList } from './components/CoinList';
import { TabBar } from './components/TabBar';
import { SearchBar } from './components/SearchBar';
import { AlertsView } from './components/AlertsView';
import { Tab } from './types';

export function App() {
  const { tg, expand } = useTelegram();
  const { prices, loading } = usePrices();
  const { user, toggleFavorite } = useUser();
  const { alerts, createAlert, deleteAlert } = useAlerts();
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const [search, setSearch] = useState('');

  useEffect(() => {
    tg.ready();
    expand();
  }, []);

  const filtered = prices.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const favorites = user?.favorites || [];
  const favoritePrices = prices.filter((c) => favorites.includes(c.id));

  return (
    <div className="app">
      <div className="header">
        <h1>CryptoTracker</h1>
        <div className="subtitle">
          {user ? `Hi, ${user.firstName || user.username || 'Trader'}` : 'Real-time crypto prices'}
        </div>
      </div>

      {activeTab !== 'alerts' && <SearchBar value={search} onChange={setSearch} />}

      {activeTab === 'market' && (
        <CoinList
          coins={search ? filtered : prices}
          loading={loading}
          favorites={user?.favorites || []}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {activeTab === 'favorites' && (
        <CoinList
          coins={search ? favoritePrices.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.symbol.toLowerCase().includes(search.toLowerCase())
          ) : favoritePrices}
          loading={loading}
          favorites={user?.favorites || []}
          onToggleFavorite={toggleFavorite}
          emptyMessage="No favorites yet. Tap the star on any coin to add it here."
        />
      )}

      {activeTab === 'alerts' && (
        <AlertsView
          alerts={alerts}
          prices={prices}
          onCreateAlert={createAlert}
          onDeleteAlert={deleteAlert}
        />
      )}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
