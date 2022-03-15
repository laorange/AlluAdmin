<script setup lang="ts">
import {computed} from "vue";
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {CourseInfo} from "../../types/api";
import {AdvancedCourseInfoHandler, CoursePlanContainer} from "../../utils/ApiDataHandlers/CourseInfoHandler";

const store = useCounterStore()
const apiToolkit = useApiToolkit()

const maxWeek = computed<number>(() => apiToolkit.maxWeek)

const advancedInfoHandler = computed<AdvancedCourseInfoHandler>(() => store.advancedInfoHandler)

// 点击CourseInfo后的对话框
const openClickCourseInfoDialog = (inputtedInfo: CourseInfo) => {
  store.coursePlanAdmin.clickCourseInfoDialog.courseInfo = inputtedInfo;
  store.coursePlanAdmin.clickCourseInfoDialog.whetherShow = true
}

const openClickCoursePlanDialog = (inputtedInfo: CourseInfo, inputtedPlan: CoursePlanContainer) => {
  store.coursePlanAdmin.clickCoursePlanDialog.courseInfo = inputtedInfo;
  store.coursePlanAdmin.clickCoursePlanDialog.coursePlanContainer = inputtedPlan;
  store.coursePlanAdmin.clickCoursePlanDialog.whetherShow = true
}

const openClickWeeklyHoursDialog = (inputtedPlan: CoursePlanContainer, inputtedWeek: number, weeklyHour: number) => {
  if (weeklyHour > 0) {
    store.coursePlanAdmin.clickWeeklyHoursDialog.planContainer = inputtedPlan
    store.coursePlanAdmin.clickWeeklyHoursDialog.week = inputtedWeek
    store.coursePlanAdmin.clickWeeklyHoursDialog.groupName = apiToolkit.getNameOfGroups(inputtedPlan.coursePlan.groups);
    store.coursePlanAdmin.clickWeeklyHoursDialog.whetherShow = true
  }
}

</script>

<template>
  <table v-if="advancedInfoHandler.judge_getTrueWhenSelectNone(advancedInfoHandler.judge_whetherPdcIsEmpty())">
    <tr>
      <th>课程名</th>
      <th>类型</th>
      <th>授课教师</th>
      <th>分组</th>
      <th>𝚺</th>
      <th class="WeekCol" v-for="week in maxWeek" :key="week">{{ week }}</th>
    </tr>

    <template v-for="(infoContainer, InfoIndex) in advancedInfoHandler.filter_infosInSelectedSemester()" :key="InfoIndex">

      <!-- region 如果某个Info没有教学计划(Plan)，则忽略Group的筛选 -->
      <tr v-if="infoContainer.coursePlans.length === 0" :style="{backgroundColor:'#'+infoContainer.courseInfo.color}">

        <!--课程名称，需要加点击事件-->
        <td class="InfoChName" @click="openClickCourseInfoDialog(infoContainer.courseInfo)">
          {{ infoContainer.courseInfo.ch_name }}
        </td>

        <td colspan="24"
            class="NoPlanInfo" @click="openClickCourseInfoDialog(infoContainer.courseInfo)"
        >无对应教学计划
        </td>
      </tr>
      <!-- endregion -->

      <tr v-for="(planContainer, planIndex) in advancedInfoHandler.filter_plansForSelectedGroup(infoContainer)" :key="planIndex"
          :style="{backgroundColor:'#'+infoContainer.courseInfo.color}">
        <template v-if="advancedInfoHandler.judge_whetherUserDoesNotCareGroup() || advancedInfoHandler.judge_whetherPdcIsEmpty()">

          <!--课程名称，需要加点击事件-->
          <td v-if="planIndex===0"
              :rowspan="advancedInfoHandler.getRowSpanNum(infoContainer)"
              class="InfoChName" @click="openClickCourseInfoDialog(infoContainer.courseInfo)"
          >
            {{ infoContainer.courseInfo.ch_name }}
          </td>

          <!-- region Plan可点击区域，需要加点击事件-->
          <td
              class="CoursePlanClickable" @click="openClickCoursePlanDialog(infoContainer.courseInfo, planContainer)"
          >{{ planContainer.coursePlan.method }}
          </td>

          <td
              class="CoursePlanClickable" @click="openClickCoursePlanDialog(infoContainer.courseInfo, planContainer)"
          >{{ planContainer.coursePlan.teacher_name }}
          </td>

          <td
              class="CoursePlanClickable" @click="openClickCoursePlanDialog(infoContainer.courseInfo, planContainer)"
          >{{ apiToolkit.getNameOfGroups(planContainer.coursePlan.groups) }}
          </td>
          <!-- endregion -->


          <td class="TotalHours">{{ planContainer.totalHours }}</td>
          <template v-for="(weeklyHour, weekFrom0) in planContainer.weeklyHours" :key="weeklyHour">
            <td v-if="weeklyHour"
                class="CourseWeeklyHours"
                @click="openClickWeeklyHoursDialog(planContainer, weekFrom0 + 1, weeklyHour)"
            >
              {{ weeklyHour }}
            </td>
            <td v-else></td>
          </template>
        </template>
      </tr>
    </template>
  </table>

  <h1 v-else>在培养方案中，该学期无教学安排</h1>
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

.TotalHours {
  text-shadow: 0 0 2px black
}

.InfoChName, .CoursePlanClickable, .NoPlanInfo {
  cursor: pointer;
}

.CourseWeeklyHours:hover, .InfoChName:hover, .CoursePlanClickable:hover, .NoPlanInfo:hover {
  color: white;
  background-color: black;
}

</style>