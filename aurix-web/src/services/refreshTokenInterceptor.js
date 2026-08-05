let refreshPromise = null;

export function instalarInterceptorRefresh(api) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const rotaPublica =
        originalRequest?.url?.includes('/auth/login') ||
        originalRequest?.url?.includes('/auth/forgot-password') ||
        originalRequest?.url?.includes('/auth/reset-password') ||
        originalRequest?.url?.includes('/auth/refresh') ||
        originalRequest?.url?.includes('/mfa/gerar-token') ||
        originalRequest?.url?.includes('/mfa/validar-token');

      if (error.response?.status === 401 && !originalRequest?._retry && !rotaPublica) {
        originalRequest._retry = true;
        try {
          if (!refreshPromise) {
            refreshPromise = api.post('/auth/refresh', {}, {
              headers: { Authorization: `Bearer ${localStorage.getItem('aurix_refresh_token')}` },
            }).then((response) => {
              const { token, refreshToken } = response.data;
              localStorage.setItem('aurix_token', token);
              if (refreshToken) localStorage.setItem('aurix_refresh_token', refreshToken);
              return token;
            }).finally(() => {
              refreshPromise = null;
            });
          }

          const novoToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${novoToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('aurix_token');
          localStorage.removeItem('aurix_refresh_token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
}
