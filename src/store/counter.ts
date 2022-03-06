// stores/counter.js
import {defineStore} from "pinia";
import axios from "axios";
import {Classroom, Course, CourseChangeLog, CourseInfo, CoursePlan, CourseType, Group, Notice, SemesterConfig, Teacher} from "../utils/DefinedTypes";
// import dayjs from "dayjs";

const SAME_SITE_AS_DJANGO = false

export const useCounterStore = defineStore("counter", {
    state: () => {
        return {
            isLoading: false,
        };
    },
    actions: {
        async axiosGet<T>(url: string, parameters: { [key: string]: string | number } = {}) {
            this.isLoading = true;
            let response = await axios({
                method: 'get',
                url,
                params: parameters
            });
            this.isLoading = false;
            return response.data as T[];
        },
    },
});

abstract class BaseApi<T> {
    abstract getUrl(): string

    private _data: Array<T> = []

    constructor() {
        useCounterStore().axiosGet<T>(this.getUrl()).then(response => this._data = response)
    }

    filter(predicate: () => boolean) {
        return this._data.filter(predicate)
    }

    get data(): Array<T> {
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


class ClassroomApi extends BaseApi<Classroom> {
    getUrl(): string {
        return getUrlCommon("/course/api/Classroom/")
    }
}


class CourseApi extends BaseApi<Course> {
    getUrl(): string {
        return getUrlCommon("/course/api/Course/")
    }

    filterByGroupPredicate(): boolean {
        return true
    }

    // filterByGroup(){
    //     return this.filter(this.filterByGroupPredicate).filter()
    // }

}


class CourseChangeLogApi extends BaseApi<CourseChangeLog> {
    getUrl(): string {
        return getUrlCommon("/course/api/CourseChangeLog/")
    }
}


class CourseInfoApi extends BaseApi<CourseInfo> {
    getUrl(): string {
        return getUrlCommon("/course/api/CourseInfo/")
    }
}


class CoursePlanApi extends BaseApi<CoursePlan> {
    getUrl(): string {
        return getUrlCommon("/course/api/CoursePlan/")
    }
}


class CourseTypeApi extends BaseApi<CourseType> {
    getUrl(): string {
        return getUrlCommon("/course/api/CourseType/")
    }
}


class GroupApi extends BaseApi<Group> {
    getUrl(): string {
        return getUrlCommon("/course/api/Group/")
    }
}


class NoticeApi extends BaseApi<Notice> {
    getUrl(): string {
        return getUrlCommon("/course/api/Notice/")
    }
}


class SemesterConfigApi extends BaseApi<SemesterConfig> {
    getUrl(): string {
        return getUrlCommon("/course/api/SemesterConfig/")
    }
}

class TeacherApi extends BaseApi<Teacher> {
    getUrl(): string {
        return getUrlCommon("/course/api/Teacher/")
    }
}


export const useApiToolkit = defineStore("apiToolkit", {
    state: () => {
        return {
            classroomApi: new ClassroomApi(),
            courseApi: new CourseApi(),
            courseChangeLogApi: new CourseChangeLogApi(),
            courseInfoApi: new CourseInfoApi(),
            coursePlanApi: new CoursePlanApi(),
            courseTypeApi: new CourseTypeApi(),
            groupApi: new GroupApi(),
            noticeApi: new NoticeApi(),
            semesterConfigApi: new SemesterConfigApi(),
            teacherApi: new TeacherApi(),
        }
    }
})