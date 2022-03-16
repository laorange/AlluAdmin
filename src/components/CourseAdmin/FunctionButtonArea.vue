<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {computed} from "vue";

import {Delete, CirclePlus, DocumentCopy, Scissor, Edit, RefreshLeft} from "@element-plus/icons-vue";
import urls from "../../utils/urls";

const store = useCounterStore();
const apiToolkit = useApiToolkit()

const AmountOfSelectedPlan = computed<number>(() => store.courseAdmin.planIdSelected.length)
const AmountOfSelectedCourse = computed<number>(() => store.courseAdmin.courseIdSelected.length)

const whetherShowAddPlanButton = computed<boolean>(() => AmountOfSelectedCourse.value == 0)
const whetherShowEditCourseButton = computed<boolean>(() => AmountOfSelectedCourse.value == 1)
const whetherShowOtherCourseFunctionalButton = computed<boolean>(() => AmountOfSelectedCourse.value >= 1)

const clickFunc = {
  toSelectPlan() {
    store.courseAdmin.whetherShowSelectPlanDialog = true
  },
  toEdit() {
    window.open(urls.admin.changeCourse(store.courseAdmin.courseIdSelected[0]));
  },
  toCopy() {
    console.log('copy', store.courseAdmin.courseIdSelected)
  },
  toCut() {
    console.log('cut', store.courseAdmin.courseIdSelected)
  },
  toDelete() {
    console.log('delete', store.courseAdmin.courseIdSelected)
  },
  toClearSelectedCourse() {
    store.courseAdmin.courseIdSelected = []
  },
  toClearSelectedPlan() {
    store.courseAdmin.planIdSelected = []
  },
}
</script>

<template>
  <div class="FunctionButtonArea">
    <template v-if="whetherShowAddPlanButton">
      <el-button plain type="primary" :icon="CirclePlus" @click="clickFunc.toSelectPlan">选择教学计划</el-button>
      <template v-if="AmountOfSelectedPlan">
        <span>当前选择了{{ AmountOfSelectedPlan }}个教学计划</span>
        <el-button plain type="primary" :icon="RefreshLeft" @click="clickFunc.toClearSelectedPlan()">取消选择</el-button>
      </template>
      <span v-else>如需添加课程，请先<strong>选择教学计划</strong></span>
    </template>

    <el-button plain type="primary" v-if="whetherShowEditCourseButton" :icon="Edit" @click="clickFunc.toEdit()">编辑信息</el-button>

    <template v-if="whetherShowOtherCourseFunctionalButton">
      <el-button plain type="warning" :icon="DocumentCopy" @click="clickFunc.toCopy()">复制</el-button>
      <el-button plain type="warning" :icon="Scissor" @click="clickFunc.toCut()">调课</el-button>
      <el-button plain type="danger" :icon="Delete" @click="clickFunc.toDelete()">删除选中的{{ AmountOfSelectedCourse }}节课程</el-button>
      <el-button plain type="primary" :icon="RefreshLeft" @click="clickFunc.toClearSelectedCourse()">取消选择</el-button>
    </template>
  </div>
</template>

<style scoped>
.FunctionButtonArea {
  background-color: #efefef;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 10px 0;
}

.FunctionButtonArea > * {
  margin: 5px;
}
</style>