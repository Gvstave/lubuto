const fs = require("fs");
const config = require("../config.json")
const path = require("path");

// const LESSONS_DIR = path.join(__dirname, "..", "lessons");
const LESSONS_DIR = path.resolve(config.lessonDirectory);

/**
 * Reads all language folders and lesson folders.
 */
function scanLessons() {
    const tree = [];

    if (!fs.existsSync(LESSONS_DIR)) {
        return tree;
    }

    const languages = fs.readdirSync(LESSONS_DIR, {
        withFileTypes: true,
    });

    for (const language of languages) {

        if (!language.isDirectory()) continue;

        const languagePath = path.join(LESSONS_DIR, language.name);

        const lessons = [];

        const lessonFolders = fs.readdirSync(languagePath, {
            withFileTypes: true,
        });

        for (const lesson of lessonFolders) {

            if (!lesson.isDirectory()) continue;

            const lessonPath = path.join(languagePath, lesson.name);

            const indexFile = path.join(lessonPath, "index.html");

            if (!fs.existsSync(indexFile)) continue;

            const lessonNumber =
                lesson.name.match(/\d+/)?.[0] || "";

            lessons.push({
                id: `${language.name}-${lesson.name}`,
                name: lesson.name,
                displayName: `Lesson ${lessonNumber}`,
                lessonNumber: Number(lessonNumber),
                language: language.name,
                path: `/lessons/${language.name}/${lesson.name}/index.html`,
            });
        }

        lessons.sort((a, b) => {
            const na = parseInt(a.name.match(/\d+/)?.[0] || 0);
            const nb = parseInt(b.name.match(/\d+/)?.[0] || 0);

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

    tree.sort((a, b) => a.name.localeCompare(b.name));

    return tree;
}

module.exports = scanLessons;