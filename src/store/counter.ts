// stores/counter.js
import {defineStore} from "pinia";
import axios from "axios";

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
