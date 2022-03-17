<script setup lang="ts">

import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {computed} from "vue";
import {CoursePlan} from "../../../types/api";

const store = useCounterStore();
const apiToolkit = useApiToolkit();

const whatDayList = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]

const description = computed<string>(() => {
  switch (store.courseAdmin.operatingMode) {
    case "Copy":
      return "调课清单"
    case "Cut":
      return "复制清单"
    default:
      return "排课清单"
  }
})

const planIdOperating = computed<number[]>(() => {
  if (store.courseAdmin.operatingMode === "") {
    //  Mode为“”，是按教学计划添加
    return store.courseAdmin.planIdSelected
  } else {
    //  其他情况：Mode为“Copy“或”Cut”，是按选择的课程对应的教学计划添加
    return store.courseAdmin.courseIdSelected.map((courseId) => apiToolkit.course.filter(course => course.course_id === courseId)[0]?.plan)
  }
})

const planOperating = computed<CoursePlan[]>(() => apiToolkit.coursePlan.filter(plan => planIdOperating.value.indexOf(plan.plan_id) > -1))

</script>

<template>
  <ElDrawer
      v-model="store.courseAdmin.whetherShowAddingDialog"
      :title="description"
      size="50%"
      direction="rtl"
      :append-to-body="true"
  >
    <div v-if="store.weeksString">{{ store.weeksString }}</div>
    <div>{{ whatDayList[store.courseAdmin.whatDay - 1] }}</div>
    <div>{{ `第${store.courseAdmin.whichLesson * 2 - 1}、${store.courseAdmin.whichLesson * 2}节课` }}</div>

  </ElDrawer>
</template>

<style scoped>

</style>