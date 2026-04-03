import { getToken } from './auth';

// ✅ THE FIX: Use Vite's environment variable, fallback to localhost ONLY for local dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_URL = `${API_BASE}/api`;

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  
  // Hybrid Auth: Only attach token if the user is logged in
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'API Error');
  }
  return data;
};