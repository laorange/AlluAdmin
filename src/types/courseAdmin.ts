import {Course} from "./api";

export interface ElTreeOption {
    id: number,
    label: string,
    children?: ElTreeOption[]
}

export interface courseButtonInfos {
    course: Course,
    check: boolean,
}