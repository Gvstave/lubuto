import { useEffect, useRef } from "react";
import logo from "../../../public/logo_fullcolor_rgb_web.jpg";
import NotFound from "../NotFound";

interface Props {
  lesson?: string;
  showNotFound?: boolean;
  isExplorerOpen: boolean;
}

const LESSON_SERVER_HOST = window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const LESSON_SERVER_URL = `http://${LESSON_SERVER_HOST}:5000`;

export default function LessonViewer({ lesson, showNotFound, isExplorerOpen }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  function closeEmbeddedMenu() {
    frameRef.current?.contentWindow?.postMessage({ type: "lubuto:close-menu" }, LESSON_SERVER_URL);
  }

  useEffect(() => {
    if (!isExplorerOpen) closeEmbeddedMenu();
  }, [isExplorerOpen]);

  if (showNotFound) return <NotFound />;

  if (!lesson)
    return (
      <div className="h-full flex items-center justify-center">
        <img src={logo} alt="Lubuto Reader" />
      </div>
    );

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-white">
      <iframe
        src={`${LESSON_SERVER_URL}${lesson}`}
        className="block h-full min-h-0 min-w-0 w-full border-0"
        title="Lesson viewer"
        ref={frameRef}
        onLoad={closeEmbeddedMenu}
      />
    </div>
  );
}
