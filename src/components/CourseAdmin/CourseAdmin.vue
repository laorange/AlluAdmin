<script setup lang="ts">
import LazyWeekSelectBar from "./LazyWeekSelectBar.vue";
import FunctionButtonArea from "./FunctionButtonArea.vue";
import WeeklyTimetable from "./WeeklyTimetable/WeeklyTimetable.vue";

import GroupSelector from "../GroupSelector.vue";
import SelectPlanDialog from "./Dialogs/SelectPlanDialog.vue";
import AddingCourseDialog from "./Dialogs/AddingCourseDialog.vue";
import DeletingCourseDialog from "./Dialogs/DeletingCourseDialog.vue";

import {useCounterStore} from "../../store/counter";
import {SAME_SITE_AS_DJANGO} from "../../utils/urls";

const store = useCounterStore()
</script>

<template>
  <div class="CourseAdminVertical">
    <template v-if="!SAME_SITE_AS_DJANGO">
      <h1>🙈 预览模式 🙈</h1>
      <h3>如需更改信息，请前往正式管理页面</h3>
    </template>

    <div class="TopPart">
      <div>
        <h4>请选择：年级 & 分组</h4>
        <group-selector></group-selector>
      </div>
      <div>
        <div class="WeeksString">{{ store.getWeeksString() }}</div>
        <lazy-week-select-bar></lazy-week-select-bar>
      </div>
    </div>

    <div class="CourseAdminHorizontal">
      <div class="BottomPart">
        <function-button-area></function-button-area>
        <weekly-timetable class="weekly-timetable"></weekly-timetable>
        <div class="TableFooter"></div>
      </div>
    </div>
  </div>

  <!-- region Dialogs -->
  <select-plan-dialog></select-plan-dialog>
  <adding-course-dialog></adding-course-dialog>
  <deleting-course-dialog></deleting-course-dialog>
  <!-- endregion -->
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
  flex-wrap: wrap;
}

.TableFooter {
  background-color: #efefef;
  width: 100%;
  height: 30px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.WeeksString {
  color: purple;
  margin: 20px 0;
  font-size: x-large;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
}
</style>