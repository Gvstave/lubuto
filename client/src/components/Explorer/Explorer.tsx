import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import type { Language } from "../../types/lesson";

interface Props {
    tree: Language[];
    onSelect(path: string): void;
    activeLanguageId?: string;
    activeLessonNumber?: number;
}

export default function Explorer({
    tree,
    onSelect,
    activeLanguageId,
    activeLessonNumber,
}: Props) {
    const [expanded, setExpanded] = useState<string[]>([]);

    function toggle(name: string) {
        setExpanded(current =>
            current.includes(name)
                ? current.filter(x => x !== name)
                : [...current, name]
        );
    }

    return (
        <div className="h-full overflow-auto bg-[#F0F0F0] text-black py-4 border-r border-gray-300">
            {tree.map(language => {
                const isOpen = expanded.includes(language.id);

                return (
                    <div key={language.id}>
                        <div
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#cfdce1] ${language.id === activeLanguageId ? "bg-[#cfdce1] font-medium" : ""}`}
                            onClick={() => toggle(language.id)}
                        >
                            {isOpen
                                ? <ChevronDown size={16} />
                                : <ChevronRight size={16} />}
                            <span>
                                {language.name}
                            </span>
                            <span className="ml-auto ">
                                {language.lessonCount}
                            </span>
                        </div>
                        {isOpen &&
                            language.children.map(lesson => (
                                <div
                                    key={lesson.id}
                                    onClick={() => onSelect(`/${lesson.language}/${lesson.lessonNumber}`)}
                                    className={`pl-10 py-2 cursor-pointer hover:bg-[#cfdce1] flex items-center gap-2 ${language.id === activeLanguageId && lesson.lessonNumber === activeLessonNumber ? "bg-[#dde6ea] font-medium" : ""}`}
                                >
                                    <BookOpen size={15} />
                                    {lesson.displayName}
                                </div>
                            ))
                        }
                    </div>
                );
            })}
        </div>
    );
}