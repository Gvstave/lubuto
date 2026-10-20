const fs = require("fs");
const config = require("../config.json");
const path = require("path");

const LESSONS_DIR = process.env.LESSONS_DIR
  ? process.env.LESSONS_DIR
  : path.isAbsolute(config.lessonDirectory)
    ? config.lessonDirectory
    : path.resolve(__dirname, "../..", config.lessonDirectory);

console.log("Scanning lessons from:", LESSONS_DIR);

function scanLessons(lessonsDirectory = LESSONS_DIR) {
  const tree = [];

  if (!fs.existsSync(lessonsDirectory)) {
    console.error("Lessons directory does not exist:", lessonsDirectory);
    return tree;
  }

  const languages = fs.readdirSync(lessonsDirectory, {
    withFileTypes: true,
  });

  for (const language of languages) {
    if (!language.isDirectory()) continue;

    const languagePath = path.join(
      lessonsDirectory,
      language.name
    );

    const lessons = [];
    const lessonFiles = [];

    function collectLessonFiles(directory) {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          const indexFile = path.join(entryPath, "index.html");
          if (fs.existsSync(indexFile)) {
            lessonFiles.push({ directory: entryPath, name: entry.name });
          } else {
            collectLessonFiles(entryPath);
          }
        }
      }
    }

    collectLessonFiles(languagePath);

    for (const lesson of lessonFiles) {
      const relativePath = path.relative(languagePath, lesson.directory);
      const pathParts = relativePath.split(path.sep);
      const lessonNumber = parseInt(lesson.name.match(/\d+/)?.[0] || "0", 10);

      if (lessons.some((item) => item.lessonNumber === lessonNumber)) continue;

      lessons.push({
        id: `${language.name}-${relativePath}`,
        name: lesson.name,
        displayName: `Lesson ${lessonNumber}`,
        lessonNumber,
        language: language.name,
        path: `/lessons/${[language.name, ...pathParts, "index.html"]
          .map(encodeURIComponent)
          .join("/")}`,
      });
    }

    lessons.sort((a, b) => {
      const na = parseInt(
        a.name.match(/\d+/)?.[0] || "0"
      );

      const nb = parseInt(
        b.name.match(/\d+/)?.[0] || "0"
      );

      return na - nb;
    });

    tree.push({
      id: language.name,
      name: language.name,
      type: "language",
      lessonCount: lessons.length,
      children: lessons,
    });
  }

  tree.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return tree;
}

module.exports = scanLessons;
