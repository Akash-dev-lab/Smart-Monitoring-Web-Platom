import axiosInstance from './axiosInstance';

export const register = async ({ name, email, password }) => {
  const { data } = await axiosInstance.post('/auth/register', {
    name,
    email,
    password,
  });

  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await axiosInstance.post('/auth/login', {
    email,
    password,
  });

  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data;
};

export const refreshToken = async () => {
  const { data } = await axiosInstance.post('/auth/refresh');
  return data;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};
