import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || '';
    const isLoginRequest = requestUrl.includes('/auth/login');

    if (
      error.response &&
      error.response.status === 403 &&
      !isLoginRequest
    ) {
      const errorMessage = error.response.data?.message || '';

      if (errorMessage.includes('desativada')) {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        sessionStorage.setItem('flash_error', "Sessão encerrada: Sua conta foi desativada.");

        window.location.href = '/login';

        return new Promise(() => {});
      }
    }

    return Promise.reject(error);
  }
);

export default api
