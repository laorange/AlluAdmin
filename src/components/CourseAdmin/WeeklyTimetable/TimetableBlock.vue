<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {CourseRecorder} from "../../../types/courseAdmin";
import dayjs from "dayjs";
import {getIsoWeekDay} from "../../../utils/dateUtils";
import CourseCard from "../../CourseCard.vue";


const props = defineProps<{ whatDay: number, whichLesson: number, courseRecorders: CourseRecorder[] }>()

const apiToolkit = useApiToolkit()
const store = useCounterStore()

function filterForThisBlock(courseRecorder: CourseRecorder): boolean {
  let properWhatDay: boolean = getIsoWeekDay(dayjs(courseRecorder.course.date)) === props.whatDay;
  let properWhichLesson: boolean = courseRecorder.course.which_lesson === props.whichLesson;
  return properWhatDay && properWhichLesson
}
</script>

<template>
  <el-scrollbar height="140px">
    <div class="TimetableBlock">
      <div v-for="courseRecorder in courseRecorders" :key="courseRecorder.course.course_id" class="scrollbar-demo-item">
        <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
        >
          <template #content>
            <course-card :course="courseRecorder.course"></course-card>
          </template>
          <div>
            <el-checkbox v-if="filterForThisBlock(courseRecorder)"
                         v-model="courseRecorder.checked" :label="courseRecorder.course.ch_name" size="small"></el-checkbox>
          </div>
        </el-tooltip>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.TimetableBlock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.el-checkbox {
  margin-bottom: 2px;
}
</style>