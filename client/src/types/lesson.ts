export interface Lesson {

    id: string;

    name: string;

    displayName: string;

    lessonNumber: number;

    language: string;

    path: string;

}

export interface Language {

    id: string;

    name: string;

    lessonCount: number;

    children: Lesson[];

}