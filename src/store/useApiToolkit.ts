import {defineStore} from "pinia";
import {useCounterStore} from "./useCounterStore";

import {Classroom, Course, CourseChangeLog, CourseInfo, CoursePlan, CourseType, Group, Notice, SemesterConfig, Teacher} from "../types/api";
import dayjs from "dayjs";

import urls from "../utils/urls";
import {formatDate, getIsoWeekDay, getWeeksBetweenTwoDayFrom0} from "../utils/dateUtils";
import {SelectedInfo, CourseInfoContainer, CourseInfoHandler, CoursePlanContainer} from "../utils/ApiDataHandlers/CourseInfoHandler";

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

    first(): T | undefined {
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

        weekNow(): number {
            return getWeeksBetweenTwoDayFrom0(dayjs(), this.week1Monday) + 1
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
        },
        selectedInfo(): SelectedInfo {
            const store = useCounterStore();
            return new SelectedInfo(
                store.selectedSemesters,
                store.selectedGroups,
                store.selectedWeeks,
            );
        },

        judge_whetherUserDoesNotCareGroup(): boolean {
            return this.selectedInfo.selectedGroups.length === 0
        },

        filter_infosBySemester(): CourseInfoContainer[] {
            if (this.selectedInfo.selectedSemesters.length === 0) return this.courseInfoContainers
            return this.courseInfoContainers.filter(ic => this.selectedInfo.selectedSemesters.indexOf(ic.courseInfo.semester) > -1)
        },

        filter_infosByGroup(): CourseInfoContainer[] {
            return this.filter_infosBySemester.reduce((result: CourseInfoContainer[], ic: CourseInfoContainer) => {
                // filteredPlanContainers = inputtedInfoContainer.coursePlans.filter(pc => this.judge_whetherPlanForSelectedGroup(pc))
                let filteredPlanContainers = this.judge_whetherUserDoesNotCareGroup ? ic.coursePlans :
                    ic.coursePlans.filter(pc => {
                        return this.selectedInfo.selectedGroups.filter(group => pc.coursePlan.groups.indexOf(group) > -1).length > 0
                    })

                return result.concat([{
                    courseInfo: ic.courseInfo,
                    coursePlans: filteredPlanContainers
                }])
            }, [])
        },

        filter_infosByWeek(): CourseInfoContainer[] {
            // 若没有选择任何周，则直接返回 filter_infosByGroup
            if (this.selectedInfo.selectedWeeks.length === 0) return this.filter_infosByGroup

            return this.filter_infosByGroup.reduce((result: CourseInfoContainer[], ic: CourseInfoContainer) => {
                let newPlanContainers: CoursePlanContainer[] = []

                // 当 sourceCoursePlan 中包含符合条件的Course时，sourceCoursePlan 会被添加到 newPlanContainers 中
                for (const sourceCoursePlan of ic.coursePlans) {
                    let courseFiltered = sourceCoursePlan.courses.filter(course => this.selectedInfo.selectedWeeks.indexOf(
                        getWeeksBetweenTwoDayFrom0(dayjs(course.date), this.week1Monday) + 1
                    ) > -1)
                    if (courseFiltered.length > 0) {
                        newPlanContainers.push({
                            ...sourceCoursePlan,
                            courses: courseFiltered
                        })
                    }
                }

                return result.concat([{courseInfo: ic.courseInfo, coursePlans: newPlanContainers}])
            }, [])
        },

        filter_infosByWeekWithNoEmptyPlanContainer(): CourseInfoContainer[] {
            return this.filter_infosByWeek.reduce((result: CourseInfoContainer[], item: CourseInfoContainer) => {
                // 当 newPlanContainers 不为空时，当前 CourseInfoContainer 会被添加到result中
                let newPlanContainers = item.coursePlans.filter(plan => plan.courses.length > 0)
                return newPlanContainers.length > 0 ? result.concat([{...item, coursePlans: newPlanContainers}]) : result
            }, [])
        },
    },

    actions: {
        async requestData() {
            await this.requestSemesterConfig()
            this.requestDataExceptSemesterConfigAndGroup(this.period)
            await this.group.requestData({period: this.period})
        },

        async requestSemesterConfig() {
            await this.semesterConfig.requestData()
        },

        // 请求数据（不包含 SemesterConfig）
        requestDataExceptSemesterConfig(period?: number) {
            this.requestDataExceptSemesterConfigAndGroup(period)
            this.group.requestData({period: period})
        },

        // 请求数据（不包含 SemesterConfig）
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

        getNameOfGroups(groupIds: number[]): string {
            return this.group.filter(
                item => groupIds.indexOf(item.group_id) > -1
            ).reduce((output: string[], currentGroup) => {
                output.push(currentGroup.name)
                return output
            }, []).join('&')
        },

        getGroupNameOfCourse(course: Course): string {
            let groups = JSON.parse(course?.group_ids ?? '') as number[]
            return this.getNameOfGroups(groups)
        },

        getWeekOfOneCourse(course: Course): number {
            return getWeeksBetweenTwoDayFrom0(dayjs(course.date), this.week1Monday) + 1
        },

        filter_plansForSelectedGroup(inputtedInfoContainer: CourseInfoContainer, getAllPlansWhenSelectNone: boolean): CoursePlanContainer[] {
            if (getAllPlansWhenSelectNone || this.judge_whetherUserDoesNotCareGroup) return inputtedInfoContainer.coursePlans
            return inputtedInfoContainer.coursePlans.filter(pc => this.judge_whetherPlanForSelectedGroup(pc))
        },

        judge_getTrueWhenSelectNone(originalResult: boolean) {
            return originalResult || this.judge_whetherUserDoesNotCareGroup
        },

        judge_whetherCourseInfoForSelectedSemester(inputtedInfoContainer: CourseInfoContainer): boolean {
            return this.selectedInfo.selectedSemesters.indexOf(inputtedInfoContainer.courseInfo.semester) > -1
        },

        judge_whetherPlanForSelectedGroup(inputtedPlanContainer: CoursePlanContainer): boolean {
            return this.selectedInfo.selectedGroups.filter(group => inputtedPlanContainer.coursePlan.groups.indexOf(group) > -1).length > 0
        },

        judge_whetherCourseInfoHasProperPlan(inputtedInfoContainer: CourseInfoContainer): boolean {
            return this.judge_whetherCourseInfoForSelectedSemester(inputtedInfoContainer) &&
                this.filter_plansForSelectedGroup(inputtedInfoContainer, false).length > 0
        },

        judge_whetherCourseInfoForSelectedGroup(): boolean {
            return this.courseInfoContainers.filter(ic => this.judge_whetherCourseInfoHasProperPlan(ic)).length > 0;
        },

        judge_whetherInfoInThisSemesterWithoutPlan(): boolean {
            return this.filter_infosBySemester.filter(ic => ic.coursePlans.length === 0).length > 0;
        },

        judge_whetherPdcIsEmpty(): boolean {
            return this.judge_getTrueWhenSelectNone(this.judge_whetherCourseInfoForSelectedGroup() || this.judge_whetherInfoInThisSemesterWithoutPlan());
        },

        getRowSpanNum(inputtedInfoContainer: CourseInfoContainer): number {
            let rowSpan = inputtedInfoContainer.coursePlans.filter(
                pc => {
                    return this.judge_getTrueWhenSelectNone(this.judge_whetherPlanForSelectedGroup(pc));
                }
            ).length
            return rowSpan ? rowSpan : 1
        },

        filter__infosByWeek_WhatDay_WhichLesson(whatDay: number, whichLesson: number): CourseInfoContainer[] {
            let result: CourseInfoContainer[] = []
            for (const info of this.filter_infosByWeekWithNoEmptyPlanContainer) {
                let filteredPlans: CoursePlanContainer[] = []
                for (const coursePlan of info.coursePlans) {
                    let filteredCourses: Course[] = coursePlan.courses.filter(
                        course => getIsoWeekDay(dayjs(course.date)) === whatDay && course.which_lesson === whichLesson)
                    if (filteredCourses.length > 0) {
                        filteredPlans.push({
                            ...coursePlan,
                            courses: filteredCourses
                        })
                    }
                }
                if (filteredPlans.length > 0) {
                    result.push({
                        ...info,
                        coursePlans: filteredPlans
                    })
                }
            }
            return result
        },
    },
});