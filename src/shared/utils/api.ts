import axios from "axios";
import { envs } from "./envs";

export const api = axios.create({
  baseURL: envs.API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" }
});
