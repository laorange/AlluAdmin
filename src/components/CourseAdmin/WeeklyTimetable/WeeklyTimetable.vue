<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import TimetableBlock from "./TimetableBlock.vue";
import {computed} from "vue";
import {CourseRecorder} from "../../../types/courseAdmin";
import {SemesterConfig} from "../../../types/api";
import {AdvancedCourseInfoHandler} from "../../../utils/ApiDataHandlers/CourseInfoHandler";


const apiToolkit = useApiToolkit()
const store = useCounterStore()

const semesterConfig = computed((): SemesterConfig | undefined => apiToolkit.semesterConfig.first())
const maxWeek = computed(() => apiToolkit.maxWeek)

const semesterSelected = computed((): number[] => store.semesterSelected)
const groupSelected = computed((): [number, number][] => store.groupSelected)
const advancedInfoHandler = computed(() => new AdvancedCourseInfoHandler(apiToolkit.courseInfoContainers,
    semesterSelected.value,
    groupSelected.value
))

const courseRecorders = computed<CourseRecorder[]>(() => {
  for (const datum of apiToolkit.course.data) {

  }
  return []
})

</script>

<template>
  <div class="WeeklyTimetableBody">
    <template v-for="whatDay in 7">
      <div class="TimetableBlock" v-for="whichLesson in 5">
        <timetable-block :what-day="whatDay" :which-lesson="whichLesson"></timetable-block>
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