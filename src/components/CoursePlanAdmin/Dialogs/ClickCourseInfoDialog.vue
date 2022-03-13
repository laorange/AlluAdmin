<script setup lang="ts">

import {useCounterStore} from "../../../store/counter";

const store = useCounterStore()
// store.coursePlanAdmin.clickCourseInfoDialog.courseInfo.ch_name

const redirectAfterCloseTheDialog = (url: string) => {
  store.coursePlanAdmin.clickCourseInfoDialog.whetherShow = false
  window.open(url)
}
</script>

<template>
  <el-dialog
      v-model="store.coursePlanAdmin.clickCourseInfoDialog.whetherShow"
      :title="store.coursePlanAdmin.clickCourseInfoDialog.courseInfo?.ch_name ?? '暂无课程信息'"
      width="30%"
  >
    <div id="ClickCourseInfoDialogBody">
      <el-button @click="redirectAfterCloseTheDialog('')">编辑课程信息</el-button><span/>
      <el-button @click="redirectAfterCloseTheDialog('')">新增理论课(Course)</el-button><span/>
      <el-button @click="redirectAfterCloseTheDialog('')">新增习题课(TD)</el-button><span/>
      <el-button @click="redirectAfterCloseTheDialog('')">新增实验课(TP)</el-button><span/>
      <el-button @click="redirectAfterCloseTheDialog('')">新增考试安排(Exam)</el-button>
    </div>

    <template #footer>
      <el-button @click="store.coursePlanAdmin.clickCourseInfoDialog.whetherShow = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style>
#ClickCourseInfoDialogBody {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#ClickCourseInfoDialogBody el-button {
  width: 50%;
  margin-left: 0;
}
</style>