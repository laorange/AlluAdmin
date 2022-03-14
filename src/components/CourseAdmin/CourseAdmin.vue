<script setup lang="ts">
import WeekSelectBar from "./WeekSelectBar.vue";
import FunctionButtonArea from "./FunctionButtonArea.vue";
import WeeklyTimetable from "./WeeklyTimetable/WeeklyTimetable.vue";
// import 'element-plus/theme-chalk/display.css'

import GroupSelector from "../GroupSelector.vue";

</script>

<template>
  <div class="CourseAdminVertical">
    <div class="TopPart">
      <div>
        <h4>请选择：年级 & 分组 & 周数</h4>
        <group-selector></group-selector>
      </div>
      <week-select-bar></week-select-bar>
    </div>

    <div class="CourseAdminHorizontal">
      <div class="BottomPart">
        <function-button-area></function-button-area>
        <weekly-timetable class="weekly-timetable"></weekly-timetable>
        <div class="TableFooter"></div>
      </div>
    </div>
  </div>

  <h1>🚧 施工中...</h1>
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

.BottomPart {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.weekly-timetable {
  flex: 1;
}

.TopPart {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
}

.TableFooter{
  background-color: #efefef;
  width: 100%;
  height: 30px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>