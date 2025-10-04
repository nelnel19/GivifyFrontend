import axios from "axios";

const API = axios.create({
  baseURL: "https://givifybackend.onrender.com/api/auth", // Flask backend
});

export default API;
