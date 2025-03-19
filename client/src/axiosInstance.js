// client/src/axiosInstance.js
import axios from 'axios';

// We assume you have REACT_APP_API_URL set in your environment
// e.g., REACT_APP_API_URL=https://finher.onrender.com
// If you want to handle dev vs. production automatically, you can do:
// const baseURL = process.env.NODE_ENV === 'development'
//   ? 'http://localhost:5000'
//   : process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL // or the logic above
});

export default instance;
