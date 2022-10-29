import axios from 'axios';

const API_URL = '/api/users/';

const userInstance = axios.create({ baseURL: API_URL });

const signup = async (userData: any) => {
  const response = await userInstance.post('/', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.token));
  }
  return response.data;
};

const login = async (userData: any) => {
  const response = await userInstance.post('/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.token));
  }
  return response.data;
};

const token = async () => {
  const token = JSON.parse(localStorage.getItem('user') as string);
  const response = await userInstance.post(
    '/token',
    {},
    { headers: { authorization: `Bearer ${token}` } }
  );
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.token));
  }
  return response.data;
};

const logout = async () => {
  localStorage.removeItem('user');
};

const authService = {
  signup,
  login,
  token,
  logout,
};

export default authService;
