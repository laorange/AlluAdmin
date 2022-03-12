<script setup lang="ts">
import CoursePlanTable from "./CoursePlanTable.vue";
import SemesterSelector from "../SemesterSelector.vue";
import {useApiToolkit} from "../../store/counter";

const apiToolkit = useApiToolkit();

</script>

<template>
  <h1>{{ apiToolkit.semesterConfig.first()?.current_period_display ?? '本学期' }}&nbsp;教学计划</h1>
  <h3>
    <span>选择年级：</span>
    <semester-selector></semester-selector>
  </h3>
  <course-plan-table></course-plan-table>
  <h1>🚧 施工中...</h1>
</template>

<style scoped>

</style>