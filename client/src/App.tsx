import { useEffect, useState } from "react";
import ParentMenu from "./components/ParentMenu/ParentMenu";
import Explorer from "./components/Explorer/Explorer";
import LessonViewer from "./components/Viewer/LessonViewer";
import { useLessonTree } from "./hooks/useLessonTree";
import NotFound from "./components/NotFound";
import { saveRoute } from "./services/lessonStorage";

function getCurrentPath() {
  const route = window.location.protocol === "file:" ? window.location.hash.slice(1) : window.location.pathname;
  return route.split("/").filter(Boolean).length >= 2 ? route : "/";
}

export default function App() {
  const { tree, loading, error } = useLessonTree();
  const isElectronFileApp = window.location.protocol === "file:";
  const [path, setPath] = useState(getCurrentPath);
  const [languageId, lessonPart] = path.split("/").filter(Boolean);
  const lessonNumber = Number(lessonPart);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const hasLessonRoute = Boolean(languageId && lessonPart);
  const hasValidLessonNumber = Number.isFinite(lessonNumber);

  const selectedLessonPath = hasValidLessonNumber
    ? tree
        .find((language) => language.id === languageId)
        ?.children.find((lesson) => lesson.lessonNumber === lessonNumber)?.path
    : undefined;

  useEffect(() => {
    const handleNavigation = () => setPath(getCurrentPath());

    window.addEventListener(isElectronFileApp ? "hashchange" : "popstate", handleNavigation);
    return () => window.removeEventListener(isElectronFileApp ? "hashchange" : "popstate", handleNavigation);
  }, [isElectronFileApp]);

  function handleSelect(nextPath: string) {
    saveRoute(nextPath);
    setPath(nextPath);
    if (isElectronFileApp) {
      window.location.hash = nextPath;
    } else {
      window.history.replaceState({}, "", nextPath);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-center text-[#124b5a]">
        <p className="rounded-[20px] border-4 border-[#3d2b1f] bg-[#4fc3f7] px-8 py-5 text-2xl font-black text-white shadow-[inset_0_-8px_0_#0288d1]">
          Loading lessons...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white px-6 text-center text-[#124b5a]">
        <div className="rounded-[20px] border-4 border-[#3d2b1f] bg-[#ffd54f] px-8 py-6 shadow-[inset_0_-8px_0_#f9a825]">
          <h1 className="text-2xl font-black">Lessons are not ready</h1>
          <p className="mt-2 font-semibold">Please ask an adult to check the connection.</p>
        </div>
      </div>
    );
  }

  if (tree.length === 0) return <NotFound />;

  if (!hasLessonRoute) {
    return (
      <ParentMenu
        tree={tree}
        onSelect={handleSelect}
      />
    );
  }

  return (
    <main
      className={`grid h-screen min-h-0 overflow-hidden bg-white ${isExplorerOpen ? "grid-cols-[18rem_minmax(0,1fr)]" : "grid-cols-[0_minmax(0,1fr)]"}`}
    >
      <Explorer
        tree={tree}
        onSelect={handleSelect}
        activeLanguageId={languageId}
        activeLessonNumber={hasValidLessonNumber ? lessonNumber : undefined}
        isOpen={isExplorerOpen}
        onToggle={() => setIsExplorerOpen((open) => !open)}
      />
      <LessonViewer lesson={selectedLessonPath} showNotFound={!selectedLessonPath} isExplorerOpen={isExplorerOpen} />
    </main>
  );
}
