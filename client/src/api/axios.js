import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8452', // backend server
});

export default instance;
