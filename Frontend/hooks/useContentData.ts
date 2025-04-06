"use client";

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api-config';


interface ContentItem {
  id: number;
  file_type: 'Image' | 'Video' | 'Comment';
  username: string;
  date_and_time: string;
  reason: string;
  caption?: string;
}

export function useContentData() {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/moderation-history`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
  
}

