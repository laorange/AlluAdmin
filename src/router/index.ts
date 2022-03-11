import {createRouter, createWebHashHistory} from 'vue-router'
import CourseAdmin from "../components/CourseAdmin/CourseAdmin.vue";
import CoursePlanAdmin from "../components/CoursePlanAdmin/CoursePlanAdmin.vue";
import OtherAdmin from "../components/OtherAdmin/OtherAdmin.vue";


const routes = [
    {
        path: '/CoursePlanAdmin/',
        component: CoursePlanAdmin,
        query: {},
        name: 'CoursePlanAdmin',
        alias: '/'
    },
    {
        path: '/CourseAdmin/',
        component: CourseAdmin,
        name: 'CourseAdmin',
        query: {}
    },
    {
        path: '/OtherAdmin/',
        component: OtherAdmin,
        name: 'OtherAdmin',
        query: {}
    },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
