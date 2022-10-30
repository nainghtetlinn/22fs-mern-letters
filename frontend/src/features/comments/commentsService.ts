import axios from 'axios';

const API_URL = '/api/comments/';

const commentInstance = axios.create({ baseURL: API_URL });

const fetchComments = async (postId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await commentInstance.get('/', {
    params: { postId: postId },
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};
const createComment = async (commentData: { text: string; postId: string }) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await commentInstance.post('/', commentData, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};
const updateComment = async (
  commentId: string,
  commentData: { text: string }
) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await commentInstance.put(`/${commentId}`, commentData, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};
const deleteComment = async (commentId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await commentInstance.delete(`/${commentId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};
const likeComment = async (commentId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await axios.post(
    `/api/likes/comment/${commentId}`,
    {},
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
};
const unlikeComment = async (commentId: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await axios.delete(`/api/likes/comment/${commentId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

const commentsService = {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
export default commentsService;
