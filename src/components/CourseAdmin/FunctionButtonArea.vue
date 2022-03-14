<script setup lang="ts">
import {useCounterStore} from "../../store/counter";
import {computed, ref} from "vue";

import {Delete, CirclePlus, DocumentCopy, Scissor, Edit} from "@element-plus/icons-vue";
import urls from "../../utils/urls";

const store = useCounterStore();

const AmountOfSelectedPlan = computed<number>(() => store.courseAdmin.planIdSelected.length)
const AmountOfSelectedCourse = computed<number>(() => store.courseAdmin.courseIdSelected.length)

const whetherShowAddPlanButton = computed<boolean>(() => AmountOfSelectedCourse.value == 0)
const whetherShowEditCourseButton = computed<boolean>(() => AmountOfSelectedCourse.value == 1)
const whetherShowOtherCourseFunctionalButton = computed<boolean>(() => AmountOfSelectedCourse.value >= 1)

const clickFunc = {
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
    for (const courseRecorder of store.courseAdmin.courseRecorders) {
      courseRecorder.checked = false
    }
  },
}
</script>

<template>
  <div class="FunctionButtonArea">
    <template v-if="whetherShowAddPlanButton">
      <el-button plain type="primary" :icon="CirclePlus">选择教学计划</el-button>
      <span v-if="AmountOfSelectedPlan">当前选择了{{ AmountOfSelectedPlan }}个教学计划</span>
      <span v-else>如需添加课程，请先<strong>选择教学计划</strong></span>
    </template>

    <el-button plain type="primary" v-if="whetherShowEditCourseButton" :icon="Edit" @click="clickFunc.toEdit()">编辑信息</el-button>

    <template v-if="whetherShowOtherCourseFunctionalButton">
      <el-button plain type="warning" :icon="DocumentCopy" @click="clickFunc.toCopy()">复制</el-button>
      <el-button plain type="warning" :icon="Scissor" @click="clickFunc.toCut()">调课</el-button>
      <el-button plain type="danger" :icon="Delete" @click="clickFunc.toDelete()">删除选中的{{ AmountOfSelectedCourse }}节课程</el-button>
      <el-button plain type="primary" :icon="DocumentCopy" @click="clickFunc.toClearSelectedCourse()">取消选择</el-button>
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