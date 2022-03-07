import {Classroom, Course, CourseChangeLog, CourseInfo, CoursePlan, CourseType, Group, Notice, SemesterConfig, Teacher} from "./DefinedTypes";
import dayjs from "dayjs";
import axios from "axios";

let SAME_SITE_AS_DJANGO = false;


async function axiosGet<T>(url: string, parameters: { [key: string]: string | number } = {}) {
    let response = await axios({
        method: 'get',
        url,
        params: parameters
    });
    return response.data as T[];
}


class ApiGetter<T> {
    private _data: Array<T> = []

    constructor(apiUrl: string) {
        axiosGet<T>(apiUrl).then(response => this._data = response)
    }

    filter(predicate: (item: T) => boolean) {
        return this._data.filter(predicate)
    }

    first(): T {
        return this._data[0]
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


const apiToolkit = {
    data: {
        classroom: new ApiGetter<Classroom>(getUrlCommon("/course/api/Classroom/")),
        course: new ApiGetter<Course>(getUrlCommon("/course/api/Course/")),
        courseChangeLog: new ApiGetter<CourseChangeLog>(getUrlCommon("/course/api/CourseChangeLog/")),
        courseInfo: new ApiGetter<CourseInfo>(getUrlCommon("/course/api/CourseInfo/")),
        coursePlan: new ApiGetter<CoursePlan>(getUrlCommon("/course/api/CoursePlan/")),
        courseType: new ApiGetter<CourseType>(getUrlCommon("/course/api/CourseType/")),
        group: new ApiGetter<Group>(getUrlCommon("/course/api/Group/")),
        notice: new ApiGetter<Notice>(getUrlCommon("/course/api/Notice/")),
        semesterConfig: new ApiGetter<SemesterConfig>(getUrlCommon("/course/api/SemesterConfig/")),
        teacher: new ApiGetter<Teacher>(getUrlCommon("/course/api/Teacher/")),
    },
    retrieve: {
        // retrieve: get item by primary key
        classroom(pk: number): Classroom {
            return apiToolkit.data.classroom.filter(item => item.room_id == pk)[0]
        },
        course(pk: number): Course {
            return apiToolkit.data.course.filter(item => item.course_id == pk)[0]
        },
        courseInfo(pk: number): CourseInfo {
            return apiToolkit.data.courseInfo.filter(item => item.info_id == pk)[0]
        },
        coursePlan(pk: number): CoursePlan {
            return apiToolkit.data.coursePlan.filter(item => item.plan_id == pk)[0]
        },
        courseType(pk: number): CourseType {
            return apiToolkit.data.courseType.filter(item => item.type_id == pk)[0]
        },
        group(pk: number): Group {
            return apiToolkit.data.group.filter(item => item.group_id == pk)[0]
        },
        semesterConfig(): SemesterConfig {
            return apiToolkit.data.semesterConfig.first()
        },
    },
    filter: {
        // filter使用方法：
        // 取一个ApiGetter的实例，支持链式调用。例如：
        // api: ApiGetter
        // api.filter(FilterFactory_1).filter(FilterFactory_2)

        // xxxFilterFactory => (course:Course)=>boolean

        course: {
            dateFilterFactory(date: dayjs.Dayjs): (course: Course) => boolean {
                return (course: Course) => dayjs(course.date).isSame(date, "day")
            },
            courseSemesterFilterFactory(semester: number): (course: Course) => boolean {
                return (course: Course) => {
                    if (semester >= 15 || semester <= 0) {
                        return true;
                    }
                    return !(course.semester && course.semester !== semester);
                }
            },
            groupsFilterFactory(groups: number[]): (course: Course) => boolean {
                return (course: Course) => {
                    let groupIds = JSON.parse(course.group_ids)
                    return !groups.length || !!apiToolkit.data.group.filter(group => groupIds.indexOf(group.group_id) > -1).length;
                }
            },
            teacherNameFilterFactory(teacherName: string): (course: Course) => boolean {
                return (course: Course) => {
                    if (!course.teacher_name) {
                        return false
                    }
                    return course.teacher_name.indexOf(teacherName) > -1
                }
            },
            courseNameFilterFactory(courseName: string): (course: Course) => boolean {
                return (course: Course) => {
                    if (!course.ch_name || course.ch_name.indexOf(courseName) > -1) {
                        return true
                    } else if (!course.en_name || course.en_name.indexOf(courseName) > -1) {
                        return true
                    } else if (!course.fr_name || course.fr_name.indexOf(courseName) > -1) {
                        return true
                    }
                    return false
                }
            },
            periodFilterFactory(period: number): (course: Course) => boolean {
                return (course: Course) => course.period == period
            },
        },
    }
}

export default apiToolkit;