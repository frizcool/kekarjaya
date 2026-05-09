import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json();
      })
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return { settings, loading };
}
