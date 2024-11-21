import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getVisits = async () => {
  const response = await api.get('/visits');
  return response.data;
};

export const addVisit = async (employeeName) => {
  const response = await api.post('/visits', { employee_name: employeeName });
  return response.data;
};