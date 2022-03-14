import {Course, CourseInfo, CoursePlan} from "../../types/api";
import dayjs from "dayjs";
import {getWeeksBetweenTwoDayFrom0} from "../dateUtils";

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

            let _coursePlanContainer: CoursePlanContainer = {
                coursePlan,
                courses: coursesOfThisPlan,
                weeklyHours,
                totalHours,
            }

            this.infoList.filter(
                info2d => info2d.courseInfo.info_id === coursePlan.info
            )[0].coursePlans.push(_coursePlanContainer)
        }
    }
}

class AdvancedCourseInfoHandler {
    courseInfoContainers: CourseInfoContainer[]
    semesterSelected: number[]
    groupSelected: [number, number][]

    constructor(courseInfoContainers: CourseInfoContainer[], semesterSelected: number[], groupSelected: [number, number][]) {
        this.courseInfoContainers = courseInfoContainers
        this.semesterSelected = semesterSelected
        this.groupSelected = groupSelected
    }

    filter_plansForSelectedGroup(inputtedInfoContainer: CourseInfoContainer, getFullWhenSelectNone: boolean = false): CoursePlanContainer[] {
        if (getFullWhenSelectNone || this.judge_whetherUserDoesNotCareGroup()) return inputtedInfoContainer.coursePlans
        return inputtedInfoContainer.coursePlans.filter(pc => this.judge_whetherPlanForSelectedGroup(pc))
    }

    filter_infosInSelectedSemester(): CourseInfoContainer[] {
        if (this.semesterSelected.length === 0) return this.courseInfoContainers
        return this.courseInfoContainers.filter(ic => this.semesterSelected.indexOf(ic.courseInfo.semester) > -1)
    }

    judge_whetherUserDoesNotCareGroup(): boolean {
        return this.groupSelected.length === 0
    }

    judge_getTrueWhenSelectNone(originalResult: boolean) {
        return originalResult || this.judge_whetherUserDoesNotCareGroup()
    }

    judge_whetherCourseInfoForSelectedSemester(inputtedInfoContainer: CourseInfoContainer): boolean {
        return this.semesterSelected.indexOf(inputtedInfoContainer.courseInfo.semester) > -1
    }

    judge_whetherPlanForSelectedGroup(inputtedPlanContainer: CoursePlanContainer): boolean {
        return this.groupSelected.filter(group => inputtedPlanContainer.coursePlan.groups.indexOf(group[1]) > -1).length > 0
    }

    judge_whetherCourseInfoHasProperPlan(inputtedInfoContainer: CourseInfoContainer): boolean {
        return this.judge_whetherCourseInfoForSelectedSemester(inputtedInfoContainer) &&
            this.filter_plansForSelectedGroup(inputtedInfoContainer).length > 0
    }

    judge_whetherCourseInfoForSelectedGroup(): boolean {
        return this.courseInfoContainers.filter(ic => this.judge_whetherCourseInfoHasProperPlan(ic)).length > 0;
    }

    judge_whetherInfoInThisSemesterWithoutPlan(): boolean {
        return this.filter_infosInSelectedSemester().filter(ic => ic.coursePlans.length === 0).length > 0;
    }

    judge_whetherPdcIsEmpty(): boolean {
        return this.judge_getTrueWhenSelectNone(this.judge_whetherCourseInfoForSelectedGroup() || this.judge_whetherInfoInThisSemesterWithoutPlan());
    }

    getRowSpanNum(inputtedInfoContainer: CourseInfoContainer): number {
        let rowSpan = inputtedInfoContainer.coursePlans.filter(
            pc => {
                return this.judge_getTrueWhenSelectNone(this.judge_whetherPlanForSelectedGroup(pc));
            }
        ).length
        return rowSpan ? rowSpan : 1
    }
}

export {
    CoursePlanContainer,
    CourseInfoHandler,
    CourseInfoContainer,
    AdvancedCourseInfoHandler,
};