import { baseUrl } from '@/shared/http/axios'

interface RefreshResponse {
  token: string
  usuario: any
}

export const refreshTokenService = async (token: string): Promise<string> => {
  try {
    const response = await fetch(`${baseUrl}/refrescar`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data: RefreshResponse = await response.json()
    return data.token
  } catch (error) {
    throw error
  }
}
