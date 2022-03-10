import {defineStore} from "pinia";
import {useCounterStore} from "./useCounterStore";

import {Classroom, Course, CourseChangeLog, CourseInfo, CoursePlan, CourseType, Group, Notice, SemesterConfig, Teacher} from "../utils/DefinedTypes";

let SAME_SITE_AS_DJANGO = false;


class ApiRequester<T> {
    private _data: Array<T> = []
    private _apiUrl: string

    constructor(apiUrl: string) {
        this._apiUrl = apiUrl
    }

    requestData(): void {
        let store = useCounterStore()
        store.axiosGet<T>(this._apiUrl).then(response => this._data = response)
    }

    filter(predicate: (item: T) => boolean): T[] {
        return this._data.filter(predicate)
    }

    get data(): T[] {
        return this._data;
    }
}

function getUrlCommon(relativeUrl: string): string {
    if (SAME_SITE_AS_DJANGO) {
        return relativeUrl
    } else {
        return "https://siae.top" + relativeUrl
    }
}

export const useApiToolkit = defineStore("apiToolkit", {
    state: () => {
        return {
            classroom: new ApiRequester<Classroom>(getUrlCommon("/course/api/Classroom/")),
            course: new ApiRequester<Course>(getUrlCommon("/course/api/Course/")),
            courseChangeLog: new ApiRequester<CourseChangeLog>(getUrlCommon("/course/api/CourseChangeLog/")),
            courseInfo: new ApiRequester<CourseInfo>(getUrlCommon("/course/api/CourseInfo/")),
            coursePlan: new ApiRequester<CoursePlan>(getUrlCommon("/course/api/CoursePlan/")),
            courseType: new ApiRequester<CourseType>(getUrlCommon("/course/api/CourseType/")),
            group: new ApiRequester<Group>(getUrlCommon("/course/api/Group/")),
            notice: new ApiRequester<Notice>(getUrlCommon("/course/api/Notice/")),
            semesterConfig: new ApiRequester<SemesterConfig>(getUrlCommon("/course/api/SemesterConfig/")),
            teacher: new ApiRequester<Teacher>(getUrlCommon("/course/api/Teacher/")),
        };
    },
    actions: {
        requestData() {
            this.classroom.requestData()
            this.course.requestData()
            this.courseChangeLog.requestData()
            this.courseInfo.requestData()
            this.coursePlan.requestData()
            this.courseType.requestData()
            this.group.requestData()
            this.notice.requestData()
            this.semesterConfig.requestData()
            this.teacher.requestData()
        },
    },
});