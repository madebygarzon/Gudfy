export const BACKEND =
  process.env.BACKEND_URL ??
  `http://localhost:${process.env.BACKEND_PORT ?? 9000}`;
