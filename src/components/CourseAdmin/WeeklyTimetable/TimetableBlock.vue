<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {Course} from "../../../types/api";

defineProps<{ whatDay: number, whichLesson: number }>()

const apiToolkit = useApiToolkit()
const store = useCounterStore()

let courseSelectData = ref<{ [courseId: number]: boolean }>({})

let courseList = computed<Course[]>(() => {
  courseSelectData.value = []
  for (const course of apiToolkit.course.data) {
    courseSelectData.value[course.course_id] = false
  }
  return apiToolkit.course.data
})
</script>

<template>
  <el-scrollbar height="140px">
    <div class="TimetableBlock">
      <div v-for="course in courseList" :key="course.course_id" class="scrollbar-demo-item">
        <el-checkbox v-model="courseSelectData[course.course_id]" :label="course.ch_name" size="small"></el-checkbox>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.TimetableBlock{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.el-checkbox{
  margin-bottom: 2px;
}
</style>