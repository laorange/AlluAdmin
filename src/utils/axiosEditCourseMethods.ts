import axios, {AxiosResponse} from "axios";
import urls from "./urls";
import dayjs from "dayjs";
import {formatDate} from "./dateUtils";


interface CourseForPost {
    plan: number,
    room: number | undefined,
    date: dayjs.Dayjs,
    which_lesson: number,
    note?: string,
}

export function axiosAddCourse(postData: CourseForPost,
                               callbackFunction: (response?: AxiosResponse) => any) {
    let finalPostData = {
        ...postData,
        date: formatDate(postData.date)
    }
    axios.post(urls.api.courseForPostAdd, finalPostData).then(
        response => {
            callbackFunction(response)
            console.log(response)
        },
        error => {
            console.warn(error);
        },
    );
}

export function axiosDeleteCourse(courseId: number,
                                  callbackFunction: (response?: AxiosResponse) => any) {
    axios.delete(urls.api.courseForPostDelete(courseId)).then(
        response => {
            callbackFunction(response)
            console.log(response)
        },
        error => {
            console.warn(error.message);
        },
    );
}