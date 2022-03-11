<script setup lang="ts">
import WeekSelectBar from "./WeekSelectBar.vue";
import FunctionButtonArea from "./FunctionButtonArea.vue";
import WeeklyTimetable from "./WeeklyTimetable/WeeklyTimetable.vue";
import 'element-plus/theme-chalk/display.css'

</script>

<template>

  <div class="CourseAdminVertical">
    <div class="TopPart hidden-md-and-up">
      <week-select-bar :vertically-display="false"></week-select-bar>
    </div>

    <div class="CourseAdminHorizontal">
      <div class="LeftPart hidden-sm-and-down">
        <week-select-bar></week-select-bar>
      </div>

      <div class="RightPart">
        <function-button-area></function-button-area>
        <weekly-timetable class="weekly-timetable"></weekly-timetable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.CourseAdminHorizontal {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.CourseAdminVertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.LeftPart {
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