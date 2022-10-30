import axios from 'axios';

const API_URL = '/api/users/';

const authInstance = axios.create({ baseURL: API_URL });

const signup = async (userData: any) => {
  const response = await authInstance.post('/', userData);
  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data.token));
  }
  return response.data;
};

const login = async (userData: any) => {
  const response = await authInstance.post('/login', userData);
  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data.token));
  }
  return response.data;
};

const token = async () => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await authInstance.get('/token', {
    headers: { authorization: `Bearer ${token}` },
  });
  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data.token));
  }
  return response.data;
};

const logout = async () => {
  localStorage.removeItem('token');
};

const authService = {
  signup,
  login,
  token,
  logout,
};

export default authService;
