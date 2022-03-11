import {defineStore} from "pinia";
import {useCounterStore} from "./useCounterStore";

import {Classroom, Course, CourseChangeLog, CourseInfo, CoursePlan, CourseType, Group, Notice, SemesterConfig, Teacher} from "../types/api";
import dayjs from "dayjs";

let SAME_SITE_AS_DJANGO = false;


class ApiRequester<T> {
    private _data: Array<T> = []
    private _apiUrl: string

    constructor(apiUrl: string) {
        this._apiUrl = apiUrl
    }

    async requestData(parameters: { [key: string]: (string | number | undefined) } = {}) {
        let store = useCounterStore()
        await store.axiosGet<T>(this._apiUrl, parameters).then(response => this._data = response)
    }

    first(): T {
        return this._data[0]
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
        async requestSemesterConfig() {
            await this.semesterConfig.requestData()
        },
        requestData(period?: number) {
            this.classroom.requestData()
            this.course.requestData({period: period})
            this.courseChangeLog.requestData({after: dayjs().add(-3, 'day').format("YYYY-MM-DD")})
            this.courseInfo.requestData({period: period})
            this.coursePlan.requestData({period: period})
            this.courseType.requestData()
            this.group.requestData({period: period})
            this.notice.requestData()
            this.teacher.requestData()
        },
    },
});