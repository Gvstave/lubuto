import { useState } from "react";

import Explorer from "./components/Explorer/Explorer";

import LessonViewer from "./components/Viewer/LessonViewer";

import { useLessonTree } from "./hooks/useLessonTree";

export default function App() {

    const { tree, loading } = useLessonTree();

    const [lesson, setLesson] = useState("");

    if (loading)

        return <h2>Loading...</h2>;

    return (

        <div className="grid grid-cols-[320px_1fr] h-screen">

            <Explorer

                tree={tree}

                onSelect={setLesson}

            />

            <LessonViewer

                lesson={lesson}

            />

        </div>

    );

}