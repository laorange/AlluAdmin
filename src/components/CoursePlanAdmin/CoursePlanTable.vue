<script setup lang="ts">
import {computed} from "vue";
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {CourseInfo, SemesterConfig} from "../../types/api";
import dayjs from "dayjs";
import {CourseInfoHandler, CourseInfoContainer, CoursePlanContainer} from "./utils/CourseInfoHandler";

const store = useCounterStore()
const apiToolkit = useApiToolkit()

const semesterConfig = computed((): SemesterConfig | undefined => apiToolkit.semesterConfig.first())
const maxWeek = computed(() => semesterConfig.value?.max_week ?? 20)
const week1Monday = computed((): dayjs.Dayjs => dayjs(semesterConfig.value?.week1_monday_date));
const semesterSelected = computed((): number[] => store.semesterSelected)
const groupSelected = computed((): [number, number][] => store.groupSelected)

const courseInfoContainers = computed((): CourseInfoContainer[] => {
  let _courseInfoHandler = new CourseInfoHandler()

  _courseInfoHandler.addCourseInfos(apiToolkit.courseInfo.data)

  _courseInfoHandler.addCoursePlans(
      apiToolkit.coursePlan.data,
      apiToolkit.course.data,
      maxWeek.value,
      week1Monday.value
  )

  return _courseInfoHandler.infoList
})

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
</script>

<template>
  <table v-if="courseInfoContainers.filter(item=>semesterSelected.indexOf(item.courseInfo.semester)>-1).length || semesterSelected.length === 0">
    <tr>
      <th>课程名</th>
      <th>类型</th>
      <th>授课教师</th>
      <th>分组</th>
      <th>𝚺</th>
      <th class="WeekCol" v-for="week in maxWeek" :key="week">{{ week }}</th>
    </tr>

    <template v-for="(infoContainer, InfoIndex) in courseInfoContainers" :key="InfoIndex">
      <template v-if="semesterSelected.length === 0 || semesterSelected.indexOf(infoContainer.courseInfo.semester)>-1">
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

        <tr v-for="(planContainer, planIndex) in infoContainer.coursePlans" :key="planIndex"
            :style="{backgroundColor:'#'+infoContainer.courseInfo.color}">
          <template v-if="groupSelected.length === 0 || groupSelected.filter(g=>planContainer.coursePlan.groups.indexOf(g[1])>-1).length">

            <!--课程名称，需要加点击事件-->
            <td v-if="planIndex===0" :rowspan="infoContainer.coursePlans.length"
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
            <td v-for="weeklyHour in planContainer.weeklyHours" :key="weeklyHour" class="CourseWeeklyHours">{{ weeklyHour ? weeklyHour : "" }}</td>
          </template>
        </tr>
      </template>
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

.CourseWeeklyHours:hover {
  background-color: black;
  color: white;
}

.TotalHours {
  text-shadow: 0 0 2px black
}

.InfoChName, .CoursePlanClickable, .NoPlanInfo {
  cursor: pointer;
}

.InfoChName:hover, .CoursePlanClickable:hover, .NoPlanInfo:hover {
  color: white;
  background-color: black;
}

</style>