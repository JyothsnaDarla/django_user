// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // ✅ Your Django API base
  withCredentials: false, // ✅ Use true only if you're using session auth
});

export default api;
