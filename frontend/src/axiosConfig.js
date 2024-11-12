// src/axiosConfig.js
import axios from 'axios';

// Set the default configuration for axios
axios.defaults.withCredentials = true; // Important to share cookies with requests
axios.defaults.baseURL = 'http://localhost:5002'; // Replace with your Flask backend URL

export default axios;
