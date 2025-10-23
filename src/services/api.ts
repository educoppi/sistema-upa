import axios from 'axios';
const api = axios.create({
    baseURL: 'https://projeto-integrador-lf6v.onrender.com',
});

// Adiciona o token em todas as requisições
api.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

// Se a resposta for 401, faz logout e redireciona
api.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response?.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default api;