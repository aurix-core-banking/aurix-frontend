import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const authProvider = {
  login: ({ username, password }) => {
    const request = new Request(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(auth => {
        localStorage.setItem('token', auth.token);
        localStorage.setItem('permissions', JSON.stringify(auth.permissions));
        localStorage.setItem('user', JSON.stringify(auth.user));
      });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  
  checkAuth: () => {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
  },
  
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('permissions');
      localStorage.removeItem('user');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  
  getIdentity: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  getPermissions: () => {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      return Promise.resolve(permissions);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
