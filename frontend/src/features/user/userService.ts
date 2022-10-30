import axios from 'axios';

const userInstance = axios.create({ baseURL: '/api/users/profile' });
const followInstance = axios.create({ baseURL: '/api/follow' });

const getUserPosts = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await userInstance.get(`/${userId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};
const requestFollow = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await followInstance.post(
    '/request',
    { userId },
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
const calcelRequest = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await followInstance.post(
    '/cancel',
    { userId },
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
};
const unfollow = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await followInstance.post(
    '/unfollow',
    { userId },
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
};
const acceptRequest = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await followInstance.post(
    '/accept',
    { userId },
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
};
const rejectRequest = async (userId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await followInstance.post(
    '/reject',
    { userId },
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const userService = {
  getUserPosts,
  requestFollow,
  calcelRequest,
  unfollow,
  acceptRequest,
  rejectRequest,
};
export default userService;
