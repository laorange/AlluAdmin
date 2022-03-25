<script setup lang="ts">
// TimetableBlockDetailDialog
import {computed} from "vue";
import {ElOption} from "../../../types/options";
import {getFormalWhatDayString, getFormalWhichLessonString} from "../../../utils/commonUtils";
import {useApiToolkit, useStore} from "../../../store/counter";
import {getIsoWeekDay} from "../../../utils/dateUtils";
import dayjs from "dayjs";


const apiToolkit = useApiToolkit()
const store = useStore()


const multiple = {multiple: true}
const courseOptionsInPanel = computed<ElOption[]>(() => {
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
        value: filteredInfoContainer.courseInfo.info_id,
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
const rawSelectedCourses: [number, number, number][] = []
</script>

<template>
  <el-drawer
      v-model="store.courseAdmin.dataOfTimetableBlockDetailDialog.whetherShow"
      title="请选择教学计划"
      size="400px"
      direction="ttb"
      :append-to-body="true"
  >
    <el-cascader-panel
        v-model="rawSelectedCourses"
        :options="courseOptionsInPanel"
        :props="multiple">

    </el-cascader-panel>
  </el-drawer>
</template>

<style scoped>

</style>