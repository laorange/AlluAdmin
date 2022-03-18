import {Course, CourseInfo, CoursePlan} from "../../types/api";
import dayjs from "dayjs";
import {getWeeksBetweenTwoDayFrom0} from "../dateUtils";

interface CoursePlanContainer {
    coursePlan: CoursePlan,
    courses: Course[],
    weeklyHours: number[],
    totalHours: number,
    courseInfo: CourseInfo
}

interface CourseInfoContainer {
    courseInfo: CourseInfo,
    coursePlans: CoursePlanContainer[]
}

class CourseInfoHandler {
    infoList: CourseInfoContainer[] = []

    constructor(courseInfos: CourseInfo[]) {
        for (const courseInfo of courseInfos) {
            this.infoList.push({
                courseInfo: courseInfo,
                coursePlans: []
            })
        }
    }

    addCoursePlans(coursePlans: CoursePlan[], courses: Course[], maxWeekOfSemester: number, week1Monday: dayjs.Dayjs) {
        for (const coursePlan of coursePlans) {
            // 找到属于当前Plan的Course
            let coursesOfThisPlan: Course[] = courses.filter((__course) => __course.plan === coursePlan.plan_id)

            let weeklyHours = new Array(maxWeekOfSemester).fill(0)

            // 根据属于当前教学计划的课程列表，计算周课时
            for (const _course of coursesOfThisPlan) {
                // let _weekStartWith0 = Math.floor(.diff(week1Monday) / 604800000);
                let _weekStartWith0 = getWeeksBetweenTwoDayFrom0(dayjs(_course.date), week1Monday);
                if (_weekStartWith0 >= 0 && _weekStartWith0 < maxWeekOfSemester) {
                    // 每节课算2个课时
                    weeklyHours[_weekStartWith0] += 2
                }
            }

            let totalHours = weeklyHours.reduce((total: number, num: number) => total + num)

            let courseContainer = this.infoList.filter(ic => ic.courseInfo.info_id === coursePlan.info)[0]

            let _coursePlanContainer: CoursePlanContainer = {
                coursePlan,
                courses: coursesOfThisPlan,
                weeklyHours,
                totalHours,
                courseInfo: courseContainer.courseInfo
            }

            courseContainer.coursePlans.push(_coursePlanContainer)
        }
    }
}

class SelectedInfo {
    selectedSemesters: number[]
    selectedGroups: number[]
    selectedWeeks: number[]

    constructor(selectedSemesters: number[], selectedGroups: number[], selectedWeeks: number[]) {
        this.selectedSemesters = selectedSemesters
        this.selectedGroups = selectedGroups
        this.selectedWeeks = selectedWeeks
    }
}

export {
    CoursePlanContainer,
    CourseInfoHandler,
    CourseInfoContainer,
    SelectedInfo,
};