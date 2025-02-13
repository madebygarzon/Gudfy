import dotenv from "dotenv";
dotenv.config();

export const BACKEND = process.env.BACKEND_URL || "http://localhost:9000";
console.log("Backend URL:", BACKEND);
