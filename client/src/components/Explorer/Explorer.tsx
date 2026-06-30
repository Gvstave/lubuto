import { useState } from "react";

import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

import type { Language } from "../../types/lesson";

interface Props {
    tree: Language[];
    onSelect(path: string): void;
}

export default function Explorer({
    tree,
    onSelect,
}: Props) {
    const [expanded, setExpanded] = useState<string[]>([]);
    function toggle(name: string) {
        if (expanded.includes(name))
            setExpanded(expanded.filter(x => x !== name));
        else
            setExpanded([...expanded, name]);
    }

    return (
        <div className="h-full overflow-auto bg-[#F0F0F0] text-black py-4">
            {tree.map(language => (
                <div key={language.id}>
                    <div
                        className="  flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#f5f7f8]"
                        onClick={() => toggle(language.id)}
                    >
                        {expanded.includes(language.id)
                            ? <ChevronDown size={16} />
                            : <ChevronRight size={16} />}
                        <span>
                            {language.name}
                        </span>
                        <span className="ml-auto ">
                            {language.lessonCount}
                        </span>
                    </div>
                    {expanded.includes(language.id) &&
                        language.children.map(lesson => (
                            <div
                                key={lesson.id}
                                onClick={() => onSelect(lesson.path)}
                                className=" pl-10 py-2 cursor-pointer hover:bg-[#f5f7f8] flex items-center gap-2"
                            >
                                <BookOpen size={15} />
                                {lesson.displayName}
                            </div>
                        ))
                    }
                </div>
            ))}
        </div>
    );
}