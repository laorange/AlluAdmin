<script setup lang="ts">
import CoursePlanTable from "./CoursePlanTable.vue";
import {useApiToolkit} from "../../store/counter";
import GroupSelector from "../GroupSelector.vue";


const apiToolkit = useApiToolkit();

</script>

<template>
  <h1>{{ apiToolkit.semesterConfig.first()?.current_period_display ?? "本学期" }}&nbsp;教学计划</h1>
  <div>
    <div style="margin-bottom: 5px">选择: 年级 & 分组：</div>
    <group-selector></group-selector>
  </div>
  <course-plan-table></course-plan-table>
  <h1>🚧 施工中...</h1>
</template>

<style scoped>

</style>