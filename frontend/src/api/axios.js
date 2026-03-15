import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ai-resumepro-1.onrender.com/api',
});

// Intercept requests to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
