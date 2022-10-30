import axios from 'axios';

const API_URL = '/api/posts/';

const postInstance = axios.create({ baseURL: API_URL });

const getFeeds = async () => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await postInstance.get('/feeds', {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

const createPost = async (postData: { text: string; privacy: string }) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await postInstance.post('/', postData, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};
const updatePost = async (
  postId: string,
  postData: { text: string; privacy: string }
) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await postInstance.put(`/${postId}`, postData, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};
const deletePost = async (postId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await postInstance.delete(`/${postId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

const postsService = { getFeeds, createPost, updatePost, deletePost };

export default postsService;
