const isDev = process.env.NODE_ENV === "development";

export const ADMIN_URL = isDev ? "http://localhost:8081" : "";

export const LONGIN_URL = isDev ? "http://localhost:8080" : "";

export const UPLOAD_URL = isDev ? "http://localhost:8080" : "";
