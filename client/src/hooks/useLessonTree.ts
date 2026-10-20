import { useEffect, useState } from "react";
import { getLessonTree } from "../services/api";
import type { Language } from "../types/lesson";

export function useLessonTree() {
  const [tree, setTree] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLessonTree()
      .then((lessons) => {
        setTree(lessons);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { tree, loading, error };
}
