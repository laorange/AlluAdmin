<script setup lang="ts">
import CoursePlanTable from "./CoursePlanTable.vue";
import {useApiToolkit} from "../../store/counter";
import GroupSelector from "../GroupSelector.vue";

import ClickCourseInfoDialog from "./Dialogs/ClickCourseInfoDialog.vue";


const apiToolkit = useApiToolkit();

</script>

<template>
  <h1>{{ apiToolkit.semesterConfig.first()?.current_period_display ?? "本学期" }}</h1>
  <h2>教学计划</h2>
  <div>
    <div id="descriptionBeforeGroupSelector">选择: 年级 & 分组</div>
    <group-selector></group-selector>
  </div>
  <course-plan-table></course-plan-table>

  <!-- Dialogs -->
  <click-course-info-dialog></click-course-info-dialog>
</template>

<style scoped>
#descriptionBeforeGroupSelector {
  margin-bottom: 5px;
}
</style>