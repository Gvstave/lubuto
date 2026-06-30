import logo from '../../../public/logo_fullcolor_rgb_web.jpg'

interface Props {
    lesson?: string;
}

export default function LessonViewer({
    lesson,
}: Props) {
    if (!lesson)
        return (
            <div className="h-full flex items-center justify-center">
                <img src={logo} />
            </div>
        );
    return (
        <iframe
            src={`http://localhost:5000${lesson}`}
            className="w-full h-full border-0"
        />
    );
}