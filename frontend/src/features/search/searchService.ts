import axios from 'axios';

const API_URL = '/api/search/';

const searchInstance = axios.create({ baseURL: API_URL });

const search = async (s: string) => {
  const token = JSON.parse(localStorage.getItem('token') as string);
  const response = await searchInstance.get('/', {
    params: { s },
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

const searchService = { search };

export default searchService;
