import axios from 'axios';

const API_URL = '/api/likes';

const reactionInstance = axios.create({ baseURL: API_URL });

const likePost = async (postId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await reactionInstance.post(
    `/post/${postId}`,
    {},
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const unlikePost = async (postId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await reactionInstance.delete(`/post/${postId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

const likeComment = async (commentId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await reactionInstance.post(
    `/comment/${commentId}`,
    {},
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const unlikeComment = async (commentId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await reactionInstance.delete(`/comment/${commentId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

const reactionService = { likePost, unlikePost, likeComment, unlikeComment };
export default reactionService;
