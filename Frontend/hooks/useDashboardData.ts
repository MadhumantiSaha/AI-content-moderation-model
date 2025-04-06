import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api-config';

interface DashboardData {
  content_reviewed: number
  unapproved_status: number
  approval_rate: number
  hashtag_frequency: Record<string, number>
  image_count: number
  video_count: number
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`, {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}