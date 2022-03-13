import {Course, CourseInfo, CoursePlan} from "../../../types/api";
import dayjs from "dayjs";

interface CoursePlanContainer {
    coursePlan: CoursePlan,
    courses: Course[],
    weeklyHours: number[],
    totalHours: number,
}

interface CourseInfoContainer {
    courseInfo: CourseInfo,
    coursePlans: CoursePlanContainer[]
}

class CourseInfoHandler {
    infoList: CourseInfoContainer[] = []

    addCourseInfos(courseInfos: CourseInfo[]) {
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
                let _weekStartWith0 = Math.floor(dayjs(_course.date).diff(week1Monday) / 604800000);
                if (_weekStartWith0 >= 0 && _weekStartWith0 < maxWeekOfSemester) {
                    // 每节课算2个课时
                    weeklyHours[_weekStartWith0] += 2
                }
            }

            let totalHours = weeklyHours.reduce((total: number, num: number) => total + num)

            let _coursePlanContainer: CoursePlanContainer = {
                coursePlan,
                courses,
                weeklyHours,
                totalHours,
            }

            this.infoList.filter(
                info2d => info2d.courseInfo.info_id === coursePlan.info
            )[0].coursePlans.push(_coursePlanContainer)
        }
    }
}

export {
    CoursePlanContainer,
    CourseInfoHandler,
    CourseInfoContainer
};