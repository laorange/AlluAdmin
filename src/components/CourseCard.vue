<script setup lang="ts">
import {Course} from "../types/api";
import {useApiToolkit} from "../store/counter";

const props = defineProps<{ course: Course }>()

const apiToolkit = useApiToolkit()

</script>

<template>
  <div class="CourseCard" :style="{backgroundColor: course.color}">
    <div v-show="course.ch_name">{{ course.ch_name }}</div>
    <!--    <div v-show="course.en_name">{{ course.en_name }}</div>-->
    <!--    <div v-show="course.fr_name">{{ course.fr_name }}</div>-->
    <div>{{ course.date }}</div>
    <div>第{{ apiToolkit.getWeekOfOneCourse(course) }}周</div>
    <div v-show="course.method">{{ course.method }}</div>
    <div v-show="course.teacher_name">{{ course.teacher_name }}</div>
    <div v-show="props.course.groups_name">{{ props.course.groups_name }}</div>
    <div v-show="course.room_name">{{ course.room_name }}</div>
    <div v-show="course.note">{{ course.note }}</div>
    <!--  <div>which_lesson: {{ course.data.which_lesson }}</div>-->
    <!--  <div>what_day: {{ course.what_day }}</div>-->
  </div>
</template>

<style scoped>
.CourseCard {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100%;
}
</style>