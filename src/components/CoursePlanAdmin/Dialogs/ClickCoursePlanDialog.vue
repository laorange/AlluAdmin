<script setup lang="ts">

import {useCounterStore} from "../../../store/counter";
import urls from "../../../utils/urls";

const store = useCounterStore()

const redirect = (url: string) => {
  store.coursePlanAdmin.clickCoursePlanDialog.whetherShow = false
  window.open(url)
}
</script>

<template>
  <el-dialog
      v-model="store.coursePlanAdmin.clickCoursePlanDialog.whetherShow"
      :title="store.coursePlanAdmin.clickCoursePlanDialog.courseInfo?.ch_name ?? '暂无课程信息'"
      width="30%"
  >
    <div id="clickCoursePlanDialogBody">
      <el-button @click="redirect(urls.admin.changeCoursePlan(store.coursePlanAdmin.clickCoursePlanDialog.coursePlan?.plan_id))">
        编辑该教学计划
      </el-button>
    </div>

    <template #footer>
      <el-button @click="store.coursePlanAdmin.clickCoursePlanDialog.whetherShow = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style>
#clickCoursePlanDialogBody {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#clickCoursePlanDialogBody .el-button + .el-button {
  margin-left: 0;
}
</style>