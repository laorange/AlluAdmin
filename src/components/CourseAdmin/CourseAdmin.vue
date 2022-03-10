<template>
  <div class="CourseAdminBody">
    <div class="LeftPart">
      <week-select-bar></week-select-bar>
    </div>
    <div class="RightPart">
      <function-button-area></function-button-area>
      <weekly-timetable class="weekly-timetable"></weekly-timetable>
    </div>
  </div>
</template>

<script setup lang="ts">
import WeekSelectBar from "./WeekSelectBar.vue";
import FunctionButtonArea from "./FunctionButtonArea.vue";
import WeeklyTimetable from "./WeeklyTimetable/WeeklyTimetable.vue";

</script>

<style scoped>
.CourseAdminBody {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.LeftPart{
  margin-right: 5px;
}

.RightPart {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.weekly-timetable {
  flex: 1;
}

</style>