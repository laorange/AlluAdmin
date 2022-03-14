<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import TimetableBlock from "./TimetableBlock.vue";
import {computed, ref, watch} from "vue";
import {CourseRecorder} from "../../../types/courseAdmin";
import {Course, SemesterConfig} from "../../../types/api";
import {getWeeksBetweenTwoDayFrom0} from "../../../utils/dateUtils";
import dayjs from "dayjs";


const apiToolkit = useApiToolkit()
const store = useCounterStore()

const semesterConfig = computed<SemesterConfig | undefined>(() => apiToolkit.semesterConfig.first())
const maxWeek = computed<number>(() => apiToolkit.maxWeek)

const semesterSelected = computed<number[]>(() => store.semesterSelected)
const groupSelected = computed<[number, number][]>(() => store.groupSelected)
const weekSelected = computed<number[]>(() => store.courseAdmin.weekSelected)

const courseRecorders = ref<CourseRecorder[]>([])

function getWeekOfOneCourse(course: Course): number {
  return getWeeksBetweenTwoDayFrom0(dayjs(course.date), apiToolkit.week1Monday) + 1
}

function refreshCourseRecorders() {
  courseRecorders.value = []
  for (const course of apiToolkit.course.filter(course => {
    let groupIdsOfThisCourse: number[] = JSON.parse(course.group_ids) as number[]
    let properGroup: boolean = groupSelected.value.length === 0 || groupSelected.value.filter(gs => groupIdsOfThisCourse.indexOf(gs[1]) > -1).length > 0
    let properWeek: boolean = weekSelected.value.length === 0 || weekSelected.value.indexOf(getWeekOfOneCourse(course)) > -1;
    return properGroup && properWeek
  })) {
    courseRecorders.value.push({course, checked: false, week: getWeekOfOneCourse(course)})
  }
}

watch(() => semesterSelected, () => refreshCourseRecorders(), {immediate: true, deep: true})
watch(() => groupSelected, () => refreshCourseRecorders(), {immediate: true, deep: true})
watch(() => weekSelected, () => refreshCourseRecorders(), {immediate: true, deep: true})
watch(() => courseRecorders, () => {
  store.courseAdmin.courseIdSelected = []
  for (const courseRecorder of courseRecorders.value.filter(cr => cr.checked)) {
    store.courseAdmin.courseIdSelected.push(courseRecorder.course.course_id);
  }
}, {deep: true, immediate: true})

// apiToolkit.course可能为空，设置此监视，为了在数据拉取完成后再响应式加载一次页面
watch(() => apiToolkit.course, () => refreshCourseRecorders(), {deep: true})
</script>

<template>
  <div class="WeeklyTimetableBody">
    <template v-for="whatDay in 7">
      <div class="TimetableBlock" v-for="whichLesson in 5">
        <timetable-block :what-day="whatDay" :which-lesson="whichLesson" :courseRecorders="courseRecorders"></timetable-block>
      </div>
    </template>
  </div>
</template>

<style scoped>
.WeeklyTimetableBody {
  background-color: skyblue;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.TimetableBlock {
  width: 10%;
  flex: 0 0 14%;
  border: #efefef dashed 1px;
}
</style>