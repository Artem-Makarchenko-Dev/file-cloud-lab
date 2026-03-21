import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== 'undefined' && !baseURL) {
  console.warn('NEXT_PUBLIC_API_URL is not set');
}

const api = axios.create({
  baseURL: baseURL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
