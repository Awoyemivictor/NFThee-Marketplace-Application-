import axios from 'axios';

const instance =  axios.create({
  // local
  baseURL: process.env.REACT_APP_BASE_URL + '/',
  // baseURL: "http://192.168.1.143:8002" + '/',

  // baseURL: process.env.REACT_APP_RENDER_BASE_URL + '/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

export default instance;
