import { useEffect, useState } from "react";
import { getLessonTree } from "../services/api";
import type { Language } from "../types/lesson";

export function useLessonTree() {
    const [tree, setTree] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLessonTree()
            .then(setTree)
            .finally(() => setLoading(false));
    }, []);

    return { tree, loading };
}