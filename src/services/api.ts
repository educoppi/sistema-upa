import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projeto-integrador-lf6v.onrender.com',
});

// Interceptor para incluir o token automaticamente
api.interceptors.request.use(
  (config) => {
    // Evita erro quando o código roda no servidor (SSR)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o token for inválido ou expirado
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Retorna o erro para que o catch o capture
    return Promise.reject(error);
  }
);

export default api;
