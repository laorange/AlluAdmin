import {defineStore} from "pinia";
import {useCounterStore} from "./useCounterStore";

import {Classroom, Course, CourseChangeLog, CourseInfo, CoursePlan, CourseType, Group, Notice, SemesterConfig, Teacher} from "../types/api";
import dayjs from "dayjs";

import urls from "../utils/urls";
import {formatDate} from "../utils/dateUtils";


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

export const useApiToolkit = defineStore("apiToolkit", {
    state: () => {
        return {
            classroom: new ApiRequester<Classroom>(urls.api.classroom),
            course: new ApiRequester<Course>(urls.api.course),
            courseChangeLog: new ApiRequester<CourseChangeLog>(urls.api.courseChangeLog),
            courseInfo: new ApiRequester<CourseInfo>(urls.api.courseInfo),
            coursePlan: new ApiRequester<CoursePlan>(urls.api.coursePlan),
            courseType: new ApiRequester<CourseType>(urls.api.courseType),
            group: new ApiRequester<Group>(urls.api.group),
            notice: new ApiRequester<Notice>(urls.api.notice),
            semesterConfig: new ApiRequester<SemesterConfig>(urls.api.semesterConfig),
            teacher: new ApiRequester<Teacher>(urls.api.teacher),
        };
    },
    actions: {
        async requestSemesterConfig() {
            await this.semesterConfig.requestData()
        },
        requestData(period?: number) {
            this.classroom.requestData()
            this.course.requestData({period: period})
            this.courseChangeLog.requestData({after: formatDate(dayjs().add(-3, 'day'))})
            this.courseInfo.requestData({period: period})
            this.coursePlan.requestData({period: period})
            this.courseType.requestData()
            this.group.requestData({period: period})
            this.notice.requestData()
            this.teacher.requestData()
        },
        getNameOfGroups(groupIds: number[]) {
            return this.group.filter(
                item => groupIds.indexOf(item.group_id) > -1
            ).reduce((output: string[], currentGroup) => {
                output.push(currentGroup.name)
                return output
            }, []).join('&')
        }
    },
});