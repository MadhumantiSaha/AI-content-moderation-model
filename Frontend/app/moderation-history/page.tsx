"use client"; // Assuming this is a client component

import { useState, useEffect } from 'react';
import { ModerationLog } from '@/components/ModerationLog'; // Adjust the path
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";
import DashboardLayout from '@/components/dashboard-layout';
import { API_URL } from '@/lib/api-config';

interface ModerationItem {
  username: string;
  file_type: string;
  date_and_time: string;
  caption: string;
  reason: string;
  status: string;
}

export function useModerationHistory() {
  const [data, setData] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching moderation history...');
        const response = await fetch(`${API_URL}/moderation-history`,{method: 'GET'});
        if (!response.ok) {
          console.error('Error fetching moderation history:');
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Response to json');
        const result = await response.json();
        console.log(result.retrived_data);

        if (result.retrived_data) {
          console.log('result')
          setData(result.retrived_data); // Data consists of an array of moderation items
        } else {
          throw new Error(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export default function ModerationHistoryPage() {
  const { data, loading, error } = useModerationHistory();

  if (loading) {
    return (
      <DashboardLayout>
      <div className="p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
      </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      </DashboardLayout>
    );
  }

  const formattedData = data.map((item) => ({
    type: item.file_type.charAt(0).toUpperCase() + item.file_type.slice(1),
    username: item.username,
    date: item.date_and_time.split(' ')[0],
    time: item.date_and_time.split(' ')[1],
    action: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    caption: item.caption,
    reason: item.reason,
    
  }));

  return (
    <DashboardLayout>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Moderation History</h1>
      <ModerationLog entries={formattedData} caption={`${data.length} entries`} />
    </div>
    </DashboardLayout>
    
  );
  
}
