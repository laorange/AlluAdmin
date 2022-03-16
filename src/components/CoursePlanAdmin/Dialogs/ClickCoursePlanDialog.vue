<script setup lang="ts">

import {useApiToolkit, useCounterStore} from "../../../store/counter";
import urls from "../../../utils/urls";
import {computed} from "vue";

const store = useCounterStore()
const apiToolkit = useApiToolkit()

const redirect = (url: string) => {
  store.coursePlanAdmin.clickCoursePlanDialog.whetherShow = false
  window.open(url)
}

const editPlanUrl = computed<string>(() => urls.admin.changeCoursePlan(
    store.coursePlanAdmin.clickCoursePlanDialog.coursePlanContainer?.coursePlan.plan_id ?? 0
))

const methodDisplay = computed(() => store.coursePlanAdmin.clickCoursePlanDialog.coursePlanContainer?.coursePlan.method)
const teacherNameDisplay = computed(() => store.coursePlanAdmin.clickCoursePlanDialog.coursePlanContainer?.coursePlan.teacher_name)
const groupNameDisplay = computed(() => apiToolkit.getNameOfGroups(store.coursePlanAdmin.clickCoursePlanDialog.coursePlanContainer?.coursePlan.groups ?? []))
const totalHoursDisplay = computed(() => store.coursePlanAdmin.clickCoursePlanDialog.coursePlanContainer?.totalHours)
</script>

<template>
  <el-drawer
      v-model="store.coursePlanAdmin.clickCoursePlanDialog.whetherShow"
      :title="store.coursePlanAdmin.clickCoursePlanDialog.courseInfo?.ch_name ?? '暂无课程信息'"
      size="30%"
  >
    <div id="clickCoursePlanDialogBody">
      <div v-if="methodDisplay">上课方式：{{ methodDisplay }}</div>
      <div v-if="teacherNameDisplay">授课教师：{{ teacherNameDisplay }}</div>
      <div v-if="groupNameDisplay">分组：{{ groupNameDisplay }}</div>
      <div>总课时：{{ totalHoursDisplay }}</div>
      <el-button @click="redirect(editPlanUrl)" type="primary">
        编辑该教学计划
      </el-button>
    </div>

    <template #footer>
      <el-button @click="store.coursePlanAdmin.clickCoursePlanDialog.whetherShow = false">取消</el-button>
    </template>
  </el-drawer>
</template>

<style>
#clickCoursePlanDialogBody {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#clickCoursePlanDialogBody > * {
  margin-top: 10px;
  margin-bottom: 10px;
}

#clickCoursePlanDialogBody .el-button + .el-button {
  margin-left: 0;
}
</style>