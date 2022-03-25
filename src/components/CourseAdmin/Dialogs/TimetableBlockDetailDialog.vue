<script setup lang="ts">
// TimetableBlockDetailDialog
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {ElOption} from "../../../types/options";
import {getFormalWhatDayString, getFormalWhichLessonString} from "../../../utils/commonUtils";
import {useApiToolkit, useStore} from "../../../store/counter";
import {getIsoWeekDay} from "../../../utils/dateUtils";
import dayjs from "dayjs";


const apiToolkit = useApiToolkit()
const store = useStore()

const whetherUpdate = ref<boolean>(false)

const multiple = {multiple: true}
const courseOptionsInPanel = computed<ElOption[]>(() => {
  if (whetherUpdate.value) whetherUpdate.value = false
  let options = []
  for (const filteredInfoContainer of store.courseAdmin.dataOfTimetableBlockDetailDialog.filteredInfoContainers) {
    let option: ElOption = {
      label: filteredInfoContainer.courseInfo.ch_name,
      value: filteredInfoContainer.courseInfo.info_id,
      children: []
    }
    for (const pc of filteredInfoContainer.coursePlans) {
      option.children?.push({
        label: `${apiToolkit.getNameOfGroups(pc.coursePlan.groups)} ${pc.coursePlan.teacher_name}`,
        value: pc.coursePlan.plan_id,
        children: pc.courses.map((course): ElOption => {
          return {
            label: `${course.date} 第${apiToolkit.getWeekOfOneCourse(course)}周 ` +
                `${getFormalWhatDayString(getIsoWeekDay(dayjs(course.date)))} ${getFormalWhichLessonString(course.which_lesson)}`,
            value: course.course_id
          }
        })
      })
    }
    if (option?.children?.length ?? 0 > 0) {
      options.push(option)
    }
  }
  return options
})
const rawSelectedCourses = ref<[number, number, number][]>([]);
const selectedCourseIds = computed<number[]>(() => rawSelectedCourses.value.map(rc => rc[2]))

const eventFunc = {
  submit() {
    for (const optionInfo of courseOptionsInPanel.value) {
      for (const optionPlan of optionInfo?.children ?? []) {
        for (const optionCourse of optionPlan?.children ?? []) {
          let courseButtonInfo = store.courseAdmin.courseButtonInfos.filter(cbi => cbi.course.course_id === optionCourse.value)[0];
          if (courseButtonInfo) {
            courseButtonInfo.check = selectedCourseIds.value.indexOf(optionCourse.value) !== -1;
          }
        }
      }
    }
  },
  finish() {
    store.courseAdmin.dataOfTimetableBlockDetailDialog.whetherShow = false
  },
}

watch(() => store.courseAdmin.dataOfTimetableBlockDetailDialog.whetherShow, (whetherShow) => {
  if (!whetherShow) {
    rawSelectedCourses.value = [];
  } else {
    whetherUpdate.value = true
    for (const optionInfo of courseOptionsInPanel.value) {
      for (const optionPlan of optionInfo?.children ?? []) {
        for (const optionCourse of optionPlan?.children ?? []) {
          if (store.courseAdmin.courseButtonInfos.filter(cbi => cbi.course.course_id === optionCourse.value)[0]?.check) {
            rawSelectedCourses.value.push([optionInfo.value, optionPlan.value, optionCourse.value])
            console.log("rawSelectedCourses.value.push")
          }
        }
      }
    }
    courseOptionsInPanel.value
  }
})

watch(() => selectedCourseIds, () => {
  // 对话框开启时，才提交变化
  if (store.courseAdmin.dataOfTimetableBlockDetailDialog.whetherShow) eventFunc.submit()
}, {deep: true})
</script>

<template>
  <el-drawer
      v-model="store.courseAdmin.dataOfTimetableBlockDetailDialog.whetherShow"
      title="请选择已有课程"
      size="400px"
      direction="ttb"
      :append-to-body="true"
  >
    <template #footer>
      <el-button @click="eventFunc.finish()" type="primary">完成</el-button>
    </template>

    <div class="CoursePanelInTimetableBlockDetailDialog">
      <el-cascader-panel
          v-model="rawSelectedCourses"
          :options="courseOptionsInPanel"
          :props="multiple">
      </el-cascader-panel>
    </div>
  </el-drawer>
</template>

<style>
.CoursePanelInTimetableBlockDetailDialog {
  display: flex;
  justify-content: center;
}

.CoursePanelInTimetableBlockDetailDialog > .el-cascader-panel {
  width: min-content !important;
}
</style>