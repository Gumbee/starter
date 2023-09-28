import axios from 'axios';

export const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001'}/v1`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const apiSSR = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
});
