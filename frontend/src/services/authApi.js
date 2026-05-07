import axiosInstance, { authAxiosInstance } from './axiosInstance';

// export const register = async (payload) => {
//   console.log("sending",payload)
//   const { data } = await authAxiosInstance.post('/auth/register', payload);
// console.log(data)
//   return data;
// };

// // export const verifyRegisterOtp = async (payload) => {
// //   console.log("sending",payload)
// //   const { data } = await authAxiosInstance.post('/auth/verify-register-otp', payload);
// // console.log(data)
// //   return data;
// // };


// export const login = async ({ email, password }) => {
//   const { data } = await axiosInstance.post('/auth/login', {
//     email,
//     password,
//   });

//   return data;
// };

// export const logout = async () => {
//   const { data } = await axiosInstance.post('/auth/logout');
//   return data;
// };

// export const refreshToken = async () => {
//   const { data } = await axiosInstance.post('/auth/refresh');
//   return data;
// };

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
