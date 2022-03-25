import {defineStore} from "pinia";
import axios from "axios";
import {Course, CourseInfo, WhatDay, WhichLesson} from "../types/api";
import {CoursePlanContainer} from "../utils/ApiDataHandlers/CourseInfoHandler";
import getWeeksString from "../utils/getWeeksString";
import {useApiToolkit} from "./counter";
import {ElOption} from "../types/options";
import {courseButtonInfos} from "../types/courseAdmin";

type StoreState = {
    isLoading: boolean,
    alertInfo: {
        success: string,
        info: string,
        warning: string,
        error: string,
    },

    rawSelectedGroups: [number, number][],
    selectedWeeks: number[],
    // rawSelectedWeeks: [number, number][],
    courseAdmin: {
        planOptions: ElOption[],
        rawSelectedPlans: [number, number][],
        courseButtonInfos: courseButtonInfos[],
        // courseIdSelected: number[],
        operatingMode: 'Delete' | 'Cut' | 'Copy' | '',
        whetherShowDeletingDialog: boolean,
        whetherShowAddingDialog: boolean,
        whetherShowSelectPlanDialog: boolean,
        whatDay: WhatDay,
        whichLesson: WhichLesson,
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

export const useStore = defineStore("counter", {
    state: (): StoreState => {
        return {
            isLoading: false,
            alertInfo: {
                success: "",
                info: "",
                warning: "",
                error: "",
            },
            rawSelectedGroups: [],
            selectedWeeks: [],
            // rawSelectedWeeks: [],
            courseAdmin: {
                planOptions: [],
                rawSelectedPlans: [],
                courseButtonInfos: [],

                // courseIdSelected: [],
                operatingMode: '',
                whetherShowDeletingDialog: false,
                whetherShowAddingDialog: false,
                whetherShowSelectPlanDialog: false,
                whatDay: 1,
                whichLesson: 1,
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
        // selectedWeeks(): number[] {
        //     this.rawSelectedWeeks.sort((a, b) => a[1] - b[1])
        //     return this.rawSelectedWeeks.map(rw => rw[1])
        // },
        weeksString(): string {
            return getWeeksString(this.selectedWeeks)
        },
        selectedGroups(): number[] {
            return this.rawSelectedGroups.map(rg => rg[1])
        },
        selectedSemesters(): number[] {
            return Array.from(new Set(this.rawSelectedGroups.map(rg => rg[0])));
        },
        selectedPlanIds(): number[] {
            return Array.from(new Set(this.courseAdmin.rawSelectedPlans.map(rp => rp[1])));
        },
        // courseIdSelected
        selectedCourses(): Course[] {
            let selectedCourses: Course[] = []
            for (const cbi of this.courseAdmin.courseButtonInfos) {
                if (cbi.check) selectedCourses.push(cbi.course)
            }
            return selectedCourses
        },
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
        getWeeksString(): string {
            return this.weeksString
        },
        updatePlanOptions() {
            const apiToolkit = useApiToolkit()

            let planOptions = []
            for (const ic of apiToolkit.filter_infosBySemester) {
                let plans = apiToolkit.filter_plansForSelectedGroup(ic, true)
                if (plans.length > 0) {
                    let childrenOption: ElOption[] = plans.reduce((result: ElOption[], plan) => result.concat([{
                        value: plan.coursePlan.plan_id,
                        label: `${plan.coursePlan.method}-${plan.coursePlan.teacher_name ?? ''}-${apiToolkit.getNameOfGroups(plan.coursePlan.groups)}`,
                    }]), []);

                    let parentOption: ElOption = {
                        value: -ic.courseInfo.info_id,
                        label: ic.courseInfo.ch_name,
                        children: childrenOption
                    }
                    planOptions.push(parentOption)
                }
            }
            this.courseAdmin.planOptions = planOptions
        },
    },
});
