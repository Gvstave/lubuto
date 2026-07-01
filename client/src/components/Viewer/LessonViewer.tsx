import logo from '../../../public/logo_fullcolor_rgb_web.jpg'
import NotFound from '../NotFound';

interface Props {
    lesson?: string;
    showNotFound?: boolean;
}

export default function LessonViewer({
    lesson,
    showNotFound,
}: Props) {
    if (showNotFound)
        return <NotFound />;

    if (!lesson)
        return (
            <div className="h-full flex items-center justify-center">
                <img src={logo} alt="Lubuto Reader" />
            </div>
        );

    return (
        <iframe
            src={`http://localhost:5000${lesson}`}
            className="w-full h-full border-0"
            title="Lesson viewer"
        />
    );
}