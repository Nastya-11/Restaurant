import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001"
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    config.headers.role = user.role;
    config.headers.user_id = user.id;
  }

  return config;
});

export default api;