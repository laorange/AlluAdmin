<script setup lang="ts">
import TimetableBlock from "./TimetableBlock.vue";

</script>

<template>
  <div class="WeeklyTimetableBody">
    <div class="TimetableBlock TimeTableHeader">星期一</div>
    <div class="TimetableBlock TimeTableHeader">星期二</div>
    <div class="TimetableBlock TimeTableHeader">星期三</div>
    <div class="TimetableBlock TimeTableHeader">星期四</div>
    <div class="TimetableBlock TimeTableHeader">星期五</div>
    <div class="TimetableBlock TimeTableHeader">星期六</div>
    <div class="TimetableBlock TimeTableHeader">星期天</div>
    <template v-for="whichLesson in 5">
      <div class="TimetableBlock" v-for="whatDay in 7">
        <timetable-block :what-day="whatDay" :which-lesson="whichLesson"></timetable-block>
      </div>
    </template>
  </div>
</template>

<style scoped>
.WeeklyTimetableBody {
  background-color: #e0e0ee;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.TimetableBlock {
  width: 14%;
  flex: 0 0 13.7%;
  border: #efefef dashed 1px;
}

.TimeTableHeader {
  margin: 5px 0;
}
</style>