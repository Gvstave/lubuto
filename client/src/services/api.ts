import type { Language } from "../types/lesson";

const LESSON_SERVER_HOST = window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API = `http://${LESSON_SERVER_HOST}:5000/api`;

export async function getLessonTree(): Promise<Language[]> {
  const response = await fetch(`${API}/tree`);

  if (!response.ok) throw new Error("Failed to load lessons");

  return response.json();
}
