import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const addEmployee = async (name) => {
  const response = await api.post('/employees', { name });
  return response.data;
};

export const getSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

export const addVisit = async (employeeId) => {
  const response = await api.post('/visits', { employee_id: employeeId });
  return response.data;
};

export const resetTodayVisits = async () => {
  const response = await api.delete('/visits/today');
  return response.data;
};