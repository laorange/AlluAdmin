<script setup lang="ts">

import {computed} from "vue";
import {useApiToolkit} from "../../store/counter";


const apiToolkit = useApiToolkit()

const maxWeek = computed(()=>apiToolkit.semesterConfig.first()?.max_week ?? 20)

</script>

<template>
  <table>
    <tr>
      <th>课程名</th>
      <th>类型</th>
      <th>授课教师</th>
      <th>分组</th>
      <th>𝚺</th>
      <th class="WeekCol" v-for="week in maxWeek" :key="week">{{ week }}</th>
    </tr>

    <!--    region none     -->
    <!--    <tr v-for="(item, index) in tableData" :key="index" :style="{backgroundColor:'#'+item.color}">-->
    <!--      <template v-if="useMenu">-->
    <!--        <td v-if="item.info" :rowspan="item.rowSpan" v-right-click:[item._data]="menuHandle.courseInfo()">-->
    <!--          {{ item.info }}-->
    <!--        </td>-->

    <!--        <template v-if="item.method">-->
    <!--          <td v-right-click:[item._data]="menuHandle.coursePlan()">{{ item.method }}</td>-->
    <!--        </template>-->
    <!--        <template v-else>-->
    <!--          <td v-right-click:[item._data]="menuHandle.courseInfo()">暂无教学计划</td>-->
    <!--        </template>-->
    <!--      </template>-->

    <!--      <template v-if="!useMenu">-->
    <!--        <td v-if="item.info" :rowspan="item.rowSpan">{{ item.info }}</td>-->
    <!--        <td>{{ item.method }}</td>-->
    <!--      </template>-->

    <!--      <td>{{ item.teacher }}</td>-->
    <!--      <td>{{ item.groups }}</td>-->
    <!--      <template v-for="(_CourseHourInThisWeek, _index) in item.weekRecord" :key="_index">-->
    <!--        &lt;!&ndash;        <td v-if="_CourseHourInThisWeek" @dblclick="store.getDataAndShowCourseListDialog(item._data.plan_id, _index)" class="CourseWeeklyHours">&ndash;&gt;-->
    <!--        &lt;!&ndash;          {{ _CourseHourInThisWeek }}&ndash;&gt;-->
    <!--        &lt;!&ndash;        </td>&ndash;&gt;-->
    <!--        &lt;!&ndash;        <td v-else></td>&ndash;&gt;-->
    <!--        <td @dblclick="store.getDataAndShowCourseListDialog(item._data.plan_id, _index)" class="CourseWeeklyHours">-->
    <!--          {{ _CourseHourInThisWeek ? _CourseHourInThisWeek : "&nbsp;" }}-->
    <!--        </td>-->
    <!--      </template>-->
    <!--    </tr>-->
    <!--    endregion-->

  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
}

tr, th, td {
  border: black solid 1px;
  padding: 5px;
}

.WeekCol {
  width: 20px;
}

.CourseWeeklyHours {
  cursor: pointer;
  user-select: none;
}

.CourseWeeklyHours:hover {
  background-color: black;
  color: white;
}
</style>