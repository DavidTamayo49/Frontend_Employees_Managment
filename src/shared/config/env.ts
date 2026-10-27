const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('Falta la variable de entorno VITE_API_URL (revisa el archivo .env).')
}

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ''),
} as const
