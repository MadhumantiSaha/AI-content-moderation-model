import { useEffect, useState } from 'react';

interface ContentData {
    username: string
    file_type: string
    date_and_time: string
    caption: string
    hashtags: string
    status: string
    reason: string
  }

export function useContentData() {
  const [data, setData] = useState<ContentData[]>([]);//useState<ContentData[] | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/content_review',{method:'GET'}); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json();
        console.log('API Response:', result);
        setData(result.retrived_data); // Store the retrieved data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData();
  }, []);
  return { data, loading, error }
}