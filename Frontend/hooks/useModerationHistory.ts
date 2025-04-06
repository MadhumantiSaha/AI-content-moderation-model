import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api-config';

interface ModerationItem {
  username: string
  file_type: string
  date_and_time: string
  caption: string
  hashtags: string[]
  status: string
}

export function useModerationHistory() {
  const [data, setData] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/moderation-history`, {
          method: 'GET',
        })
        console.log(response)
        const result = await response.json()
        console.log(result)
        if (result) {
          setData(result.data.retrived_data) // Data consists of an array of moderation items
        } else {
          throw new Error(result.message || 'Failed to fetch data')
        }
      } catch (err) {
        console.log('Error:')
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}