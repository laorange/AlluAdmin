import {defineStore} from "pinia";
import axios from "axios";
import {CourseInfo, WhatDay, WhichLesson} from "../types/api";
import {AdvancedCourseInfoHandler, CoursePlanContainer} from "../utils/ApiDataHandlers/CourseInfoHandler";
import {CourseRecorder} from "../types/courseAdmin";
import {useApiToolkit} from "./counter";

type CounterStoreState = {
    isLoading: boolean,
    semesterSelected: number[],
    groupSelected: [number, number][],
    courseAdmin: {
        weekSelected: number[],
        planIdSelected: number[],
        courseIdSelected: number[],
        courseIdCopying: number[],
        courseIdCutting: number[],
        courseIdAdding: number[],
        courseIdDeleting: number[],
        whetherShowDeletingDialog: boolean,
        whetherShowAddingDialog: boolean,
        whetherShowSelectPlanDialog: boolean,
        whatDay: WhatDay,
        whichLesson: WhichLesson,
        courseRecorders: CourseRecorder[],
    },
    coursePlanAdmin: {
        clickCourseInfoDialog: {
            whetherShow: boolean,
            courseInfo: CourseInfo | undefined
        }
        clickCoursePlanDialog: {
            whetherShow: boolean,
            courseInfo: CourseInfo | undefined
            coursePlanContainer: CoursePlanContainer | undefined
        },
        clickWeeklyHoursDialog: {
            whetherShow: boolean,
            week: number,
            groupName: string,
            planContainer: CoursePlanContainer | undefined,
        },
    }
}

export const useCounterStore = defineStore("counter", {
    state: (): CounterStoreState => {
        return {
            isLoading: false,
            semesterSelected: [],
            groupSelected: [],
            courseAdmin: {
                weekSelected: [],
                planIdSelected: [],
                courseIdSelected: [],
                courseIdCopying: [],
                courseIdCutting: [],
                courseIdAdding: [],
                courseIdDeleting: [],
                whetherShowDeletingDialog: false,
                whetherShowAddingDialog: false,
                whetherShowSelectPlanDialog: false,
                whatDay: 1,
                whichLesson: 1,
                courseRecorders: [],
            },
            coursePlanAdmin: {
                clickCourseInfoDialog: {
                    whetherShow: false,
                    courseInfo: undefined
                },
                clickCoursePlanDialog: {
                    whetherShow: false,
                    courseInfo: undefined,
                    coursePlanContainer: undefined
                },
                clickWeeklyHoursDialog: {
                    whetherShow: false,
                    week: 0,
                    groupName: '',
                    planContainer: undefined,
                },
            },
        };
    },
    getters: {
        advancedInfoHandler(): AdvancedCourseInfoHandler {
            const apiToolkit = useApiToolkit();
            return new AdvancedCourseInfoHandler(
                apiToolkit.courseInfoContainers,
                this.semesterSelected,
                this.groupSelected
            )
        }
    },
    actions: {
        async axiosGet<T>(url: string, parameters: { [key: string]: (string | number | undefined) } = {}) {
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
