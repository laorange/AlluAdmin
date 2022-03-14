import {defineStore} from "pinia";
import {useCounterStore} from "./useCounterStore";

import {Classroom, Course, CourseChangeLog, CourseInfo, CoursePlan, CourseType, Group, Notice, SemesterConfig, Teacher} from "../types/api";
import dayjs from "dayjs";

import urls from "../utils/urls";
import {formatDate} from "../utils/dateUtils";
import {CourseInfoContainer, CourseInfoHandler} from "../utils/ApiDataHandlers/CourseInfoHandler";


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
    getters: {
        maxWeek(): number {
            return this.semesterConfig.first()?.max_week ?? 20
        },
        week1Monday(): dayjs.Dayjs {
            return dayjs(this.semesterConfig.first()?.week1_monday_date)
        },
        period(): number {
            return this.semesterConfig.first()?.current_period ?? 0
        },
        periodDisplay(): string {
            return this.semesterConfig.first()?.current_period_display ?? '本学期'
        },
        courseInfoContainers(): CourseInfoContainer[] {
            let _courseInfoHandler = new CourseInfoHandler(this.courseInfo.data)
            _courseInfoHandler.addCoursePlans(
                this.coursePlan.data,
                this.course.data,
                this.maxWeek,
                this.week1Monday,
            )
            return _courseInfoHandler.infoList
        }
    },
    actions: {
        async requestSemesterConfig() {
            await this.semesterConfig.requestData()
        },
        requestData(period?: number) {
            this.requestDataExceptSemesterConfigAndGroup(period)
            this.group.requestData({period: period})
        },
        requestDataExceptSemesterConfigAndGroup(period?: number) {
            this.classroom.requestData()
            this.course.requestData({period: period})
            this.courseChangeLog.requestData({after: formatDate(dayjs().add(-3, 'day'))})
            this.courseInfo.requestData({period: period})
            this.coursePlan.requestData({period: period})
            this.courseType.requestData()
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