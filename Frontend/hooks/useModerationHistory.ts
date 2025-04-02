import { useState, useEffect } from 'react'

interface ModerationItem {
  id: number
  contentId: string
  type: "image" | "video"
  title: string
  username: string
  caption: string
  timestamp: string
  action: "approved" | "rejected"
  reason: string
}

export function useModerationHistory() {
  const [data, setData] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/moderation-history')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        if (result.status === 'success') {
          setData(result.data) // Data consists of an array of moderation items
        } else {
          throw new Error(result.message || 'Failed to fetch data')
        }
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