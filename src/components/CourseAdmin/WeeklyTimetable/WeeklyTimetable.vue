<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import TimetableBlock from "./TimetableBlock.vue";
import {computed, watch} from "vue";

const apiToolkit = useApiToolkit()
const store = useCounterStore()

const semesterSelected = computed<number[]>(() => store.semesterSelected)
const groupSelected = computed<[number, number][]>(() => store.groupSelected)
const weekSelected = computed<number[]>(() => store.courseAdmin.weekSelected)

function refreshCourseRecorders() {
  store.courseAdmin.courseRecorders = []
  for (const course of apiToolkit.course.filter(course => {
    let groupIdsOfThisCourse: number[] = JSON.parse(course.group_ids) as number[]
    let properGroup: boolean = groupSelected.value.length === 0 || groupSelected.value.filter(gs => groupIdsOfThisCourse.indexOf(gs[1]) > -1).length > 0
    let properWeek: boolean = weekSelected.value.length === 0 || weekSelected.value.indexOf(apiToolkit.getWeekOfOneCourse(course)) > -1;
    return properGroup && properWeek
  })) {
    store.courseAdmin.courseRecorders.push({course, checked: false, week: apiToolkit.getWeekOfOneCourse(course)})
  }
}

watch(() => semesterSelected, () => refreshCourseRecorders(), {immediate: true, deep: true})
watch(() => groupSelected, () => refreshCourseRecorders(), {immediate: true, deep: true})
watch(() => weekSelected, () => refreshCourseRecorders(), {immediate: true, deep: true})
watch(() => store.courseAdmin.courseRecorders, () => {
  store.courseAdmin.courseIdSelected = []
  for (const courseRecorder of store.courseAdmin.courseRecorders.filter(cr => cr.checked)) {
    store.courseAdmin.courseIdSelected.push(courseRecorder.course.course_id);
  }
}, {deep: true, immediate: true})

// apiToolkit.course可能为空，设置此监视，为了在数据拉取完成后再响应式加载一次页面
watch(() => apiToolkit.course, () => refreshCourseRecorders(), {deep: true})
</script>

<template>
  <div class="WeeklyTimetableBody">
    <div class="TimetableBlock TimeTableHeader">星期一</div>
    <div class="TimetableBlock TimeTableHeader">星期二</div>
    <div class="TimetableBlock TimeTableHeader">星期三</div>
    <div class="TimetableBlock TimeTableHeader">星期四</div>
    <div class="TimetableBlock TimeTableHeader">星期五</div>
    <div class="TimetableBlock TimeTableHeader">星期六</div>
    <div class="TimetableBlock TimeTableHeader">星期天</div>
    <template v-for="whichLesson in 5">
      <div class="TimetableBlock" v-for="whatDay in 7">
        <timetable-block :what-day="whatDay" :which-lesson="whichLesson" :courseRecorders="store.courseAdmin.courseRecorders"></timetable-block>
      </div>
    </template>
  </div>
</template>

<style scoped>
.WeeklyTimetableBody {
  background-color: #e0e0ee;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.TimetableBlock {
  width: 14%;
  flex: 0 0 13.7%;
  border: #efefef dashed 1px;
}

.TimeTableHeader {
  margin: 5px 0;
}
</style>