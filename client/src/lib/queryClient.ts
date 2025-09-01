import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Default fetcher function for React Query
export const defaultQueryFn = async ({ queryKey }: { queryKey: unknown[] }): Promise<any> => {
  const url = queryKey[0] as string
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Helper function for API requests
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Setup default query function
queryClient.setDefaultOptions({
  queries: {
    queryFn: defaultQueryFn,
  },
})