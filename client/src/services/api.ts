import type { Language } from "../types/lesson";

const API = "http://localhost:5000/api";

export async function getLessonTree(): Promise<Language[]> {
    const response = await fetch(`${API}/tree`);

    if (!response.ok)
        throw new Error("Failed to load lessons");

    return response.json();
}