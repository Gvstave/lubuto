import { useEffect, useState } from "react";
import Explorer from "./components/Explorer/Explorer";
import LessonViewer from "./components/Viewer/LessonViewer";
import { useLessonTree } from "./hooks/useLessonTree";
import NotFound from "./components/NotFound";

export default function App() {
  const { tree, loading } = useLessonTree();
  const [path, setPath] = useState(() => window.location.pathname);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [languageId, lessonPart] = path.split("/").filter(Boolean);
  const lessonNumber = Number(lessonPart);
  const hasLessonRoute = Boolean(languageId && lessonPart);
  const hasValidLessonNumber = Number.isFinite(lessonNumber);

  const selectedLessonPath = hasValidLessonNumber
    ? tree
        .find((language) => language.id === languageId)
        ?.children.find((lesson) => lesson.lessonNumber === lessonNumber)?.path
    : undefined;

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleSelect(nextPath: string) {
    setPath(nextPath);
    window.history.replaceState({}, "", nextPath);
  }

  if (!loading && tree.length === 0) return <NotFound />;

  return (
    <div
      className={`grid h-screen min-h-0 overflow-hidden ${explorerOpen ? "grid-cols-[320px_minmax(0,1fr)]" : "grid-cols-[0_minmax(0,1fr)]"}`}
    >
      <Explorer
        tree={tree}
        onSelect={handleSelect}
        activeLanguageId={languageId}
        activeLessonNumber={hasValidLessonNumber ? lessonNumber : undefined}
        isOpen={explorerOpen}
        onToggle={() => setExplorerOpen((current) => !current)}
      />
      <LessonViewer
        lesson={selectedLessonPath}
        showNotFound={hasLessonRoute && !selectedLessonPath}
      />
    </div>
  );
}
