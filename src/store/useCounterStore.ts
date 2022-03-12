import {defineStore} from "pinia";
import axios from "axios";

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
        whatDay: 1 | 2 | 3 | 4 | 5 | 6 | 7,
        whichLesson: 1 | 2 | 3 | 4 | 5,
    },
    coursePlanAdmin: {
        period: number | undefined,
        semester: number | undefined,
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
                whatDay: 1,
                whichLesson: 1,
            },
            coursePlanAdmin: {
                period: undefined,
                semester: undefined,
            }
        };
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
