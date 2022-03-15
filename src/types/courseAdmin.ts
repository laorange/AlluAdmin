import {Course} from "./api";

export interface CourseRecorder {
    course: Course,
    checked: boolean,
    week: number
}

export interface ElTreeOption {
    id: number,
    label: string,
    children?: ElTreeOption[]
}