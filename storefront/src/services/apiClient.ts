export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/novatech-api'

export const fetchApi = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    return await fetch(input, init)
  } catch {
    throw new Error(
      'Không kết nối được backend. Hãy bật Apache/MySQL trong XAMPP và kiểm tra cấu hình API cục bộ.',
    )
  }
}

export const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : 'Không thể kết nối API.'

    throw new Error(message)
  }

  return payload as T
}
