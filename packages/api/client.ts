import axios from 'axios';
import { API_BASE_URL } from './constants';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const apiSSR = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
});
