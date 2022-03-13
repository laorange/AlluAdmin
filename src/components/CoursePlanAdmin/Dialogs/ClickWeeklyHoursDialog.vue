<script setup lang="ts">
import dayjs from "dayjs";

import {computed} from "vue";
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {Course, WhatDay, WhichLesson} from "../../../types/api";
import {getIsoWeekDay, getWeeksBetweenTwoDayFrom0} from "../../../utils/dateUtils";


const store = useCounterStore();
const apiToolkit = useApiToolkit()

const groupName = computed(() => store.coursePlanAdmin.clickWeeklyHoursDialog.groupName)
const week = computed(() => store.coursePlanAdmin.clickWeeklyHoursDialog.week)

function filterCourse(whatDay: WhatDay | number, whichLesson: WhichLesson | number): Course[] {
  return (store.coursePlanAdmin.clickWeeklyHoursDialog.planContainer?.courses ?? []).filter(
      (course: Course) => {
        console.log("getWeeksBetweenTwoDayFrom0(dayjs(), dayjs(apiToolkit.semesterConfig.first()?.week1_monday_date)) + 1", getWeeksBetweenTwoDayFrom0(dayjs(), dayjs(apiToolkit.semesterConfig.first()?.week1_monday_date)) + 1)
        console.log("week.value", week.value)
        return getIsoWeekDay(dayjs(course.date)) === whatDay
            && whichLesson === course.which_lesson
            && getWeeksBetweenTwoDayFrom0(dayjs(course.date), dayjs(apiToolkit.semesterConfig.first()?.week1_monday_date)) + 1 === week.value
      })
}

</script>

<template>
  <el-dialog v-model="store.coursePlanAdmin.clickWeeklyHoursDialog.whetherShow"
             :title="`第 ${store.coursePlanAdmin.clickWeeklyHoursDialog.week} 周`" :fullscreen="false" width="95%">

    <div class="dialogBody">
      <div class="TimeBlock">
        <div class="TimeBlockHead">星期一</div>
        <div class="TimeBlockHead">星期二</div>
        <div class="TimeBlockHead">星期三</div>
        <div class="TimeBlockHead">星期四</div>
        <div class="TimeBlockHead">星期五</div>
        <div class="TimeBlockHead">星期六</div>
        <div class="TimeBlockHead">星期日</div>

        <template v-for="whichLesson in 5" :key="whichLesson">
          <template v-for="whatDay in 7" :key="whatDay">
            <div class="TimeBlockItem">
              <div class="CourseCard" v-for="course in filterCourse(whatDay, whichLesson)"
                   :key="course.course_id" :style="{backgroundColor: '#' + course.color}">
                <!--  <div>row:{{ row }},col:{{ col }}</div>-->
                <!--  <div>which_lesson: {{ course.data.which_lesson }}</div>-->
                <!--  <div>what_day: {{ course.what_day }}</div>-->
                <div v-show="course.ch_name">{{ course.ch_name }}</div>
                <div v-show="course.en_name">{{ course.en_name }}</div>
                <div v-show="course.fr_name">{{ course.fr_name }}</div>
                <div v-show="course.date">{{ course.date }}</div>
                <div v-show="course.method">{{ course.method }}</div>
                <div v-show="course.teacher_name">{{ course.teacher_name }}</div>
                <div v-show="groupName">{{ groupName }}</div>
                <div v-show="course.room_name">{{ course.room_name }}</div>
                <div v-show="course.note">{{ course.note }}</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.TimeBlock {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: black;
}

.TimeBlockHead, .TimeBlockItem {
  border: black 1px solid;
  flex: 0 0 13%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  overflow: auto;
}

.TimeBlockItem {
  height: 150px;
  cursor: pointer;
  user-select: none;
}

.CourseCard {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.TimeBlockItem {
  color: black;
}

</style>