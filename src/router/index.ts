import {createRouter, createWebHashHistory} from 'vue-router'
import CourseAdmin from "../components/CourseAdmin/CourseAdmin.vue";


const routes = [
    {
        path: '/',
        component: CourseAdmin,
        query: {}
    },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
