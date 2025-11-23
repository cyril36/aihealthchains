import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error(
    "❌ VITE_API_URL is missing. Please set it in your .env file.\nExample:\nVITE_API_URL=http://localhost:3000"
  );
}

const http = axios.create({
  baseURL: apiUrl,
});
export default http;
