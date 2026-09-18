import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { Language } from "../../types/lesson";

interface Props {
  tree: Language[];
  onSelect(path: string): void;
  activeLanguageId?: string;
  activeLessonNumber?: number;
  isOpen: boolean;
  onToggle(): void;
}

export default function Explorer({
  tree,
  onSelect,
  activeLanguageId,
  activeLessonNumber,
  isOpen,
  onToggle,
}: Props) {
  const [expanded, setExpanded] = useState<string[]>([]);

  function toggle(name: string) {
    setExpanded((current) =>
      current.includes(name) ? current.filter((x) => x !== name) : [...current, name],
    );
  }

  return (
    <div
      className={`relative h-full min-h-0 overflow-visible text-black border-r border-gray-300 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="pointer-events-auto absolute top-2 right-0 z-10 translate-x-full rounded-r border border-l-0 border-gray-300 bg-white p-2 text-gray-700 shadow-sm hover:bg-[#cfdce1]"
        aria-label={isOpen ? "Close explorer" : "Open explorer"}
        title={isOpen ? "Close explorer" : "Open explorer"}
      >
        {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
      </button>
      <div className={isOpen ? "h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain" : "hidden"}>
        {tree.map((language) => {
          const isOpen = expanded.includes(language.id);

          return (
            <div key={language.id}>
              <div
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#cfdce1] ${language.id === activeLanguageId ? "bg-[#cfdce1] font-medium" : ""}`}
                onClick={() => toggle(language.id)}
              >
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>{language.name}</span>
                <span className="ml-auto ">{language.lessonCount}</span>
              </div>
              {isOpen &&
                language.children.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => onSelect(`/${lesson.language}/${lesson.lessonNumber}`)}
                    className={`pl-10 py-2 cursor-pointer hover:bg-[#cfdce1] flex items-center gap-2 ${language.id === activeLanguageId && lesson.lessonNumber === activeLessonNumber ? "bg-[#dde6ea] font-medium" : ""}`}
                  >
                    <BookOpen size={15} />
                    {lesson.displayName}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
