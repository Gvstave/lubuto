import background from "../../../public/background.jpg";
import type { Language } from "../../types/lesson";

interface Props {
  tree: Language[];
  onSelect(path: string): void;
}

export default function ParentMenu({ tree, onSelect }: Props) {
  const getLanguageLabel = (languageName: string) => languageName === "Chiyanja" ? "Chinyanja" : languageName;
  const languageColors = [
    "bg-[#ffd54f] shadow-[inset_0_-8px_0_#f9a825] text-white",
    "bg-[#66bb6a] shadow-[inset_0_-8px_0_#388e3c] text-white",
    "bg-[#4fc3f7] shadow-[inset_0_-8px_0_#0288d1] text-white",
    "bg-[#ba68c8] shadow-[inset_0_-8px_0_#7b1fa2] text-white",
    "bg-[#ff8a65] shadow-[inset_0_-8px_0_#e64a19] text-white",
    "bg-[#f06292] shadow-[inset_0_-8px_0_#c2185b] text-white",
    "bg-[#26a69a] shadow-[inset_0_-8px_0_#00796b] text-white",
  ];
  return (
    <main
      className="flex h-screen min-h-0 items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat text-slate-800"
      style={{ backgroundImage: `url(${background})` }}
    >
      <section className="flex w-full max-w-2xl min-h-0 flex-col justify-center gap-5 overflow-y-auto px-6 py-10">
        <div className="grid gap-3 pr-5" role="listbox" aria-label="Languages">
          {tree.map((language, index) => {
            const color = languageColors[index % languageColors.length];

            return (
              <div
                key={language.id}
                role="option"
                aria-selected="false"
                onClick={() => {
                  const firstLesson = language.children[0];
                  if (firstLesson) onSelect(`/${firstLesson.language}/${firstLesson.lessonNumber}`);
                }}
                className={`flex min-h-20 w-full items-center justify-between gap-3 rounded-[20px] border-4 border-[#3d2b1f] px-4 py-3 text-left text-[1.58rem] font-black text-white font-['Comic_Sans_MS','Chalkboard_SE',sans-serif] [text-shadow:-2px_-2px_0_#3d2b1f,2px_-2px_0_#3d2b1f,-2px_2px_0_#3d2b1f,2px_2px_0_#3d2b1f] ${color}`}
              >
                <span className="flex items-center gap-3">
                  {/* <Languages size={27} strokeWidth={2.5} aria-hidden="true" /> */}
                  {getLanguageLabel(language.name)}
                </span>
                <span className="text-[1.58rem] font-black text-white">{language.lessonCount}</span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
