<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {computed} from "vue";

import {Delete, CirclePlus, DocumentCopy, Rank, Edit, RefreshLeft} from "@element-plus/icons-vue";
import urls from "../../utils/urls";

const store = useCounterStore();
const apiToolkit = useApiToolkit()

const AmountOfSelectedPlan = computed<number>(() => store.courseAdmin.rawSelectedPlans.length)
const AmountOfselectedCourses = computed<number>(() => store.selectedCourses.length)

const whetherShowAddPlanButton = computed<boolean>(() => AmountOfselectedCourses.value == 0)
const whetherShowEditCourseButton = computed<boolean>(() => AmountOfselectedCourses.value == 1)
const whetherShowOtherCourseFunctionalButton = computed<boolean>(() => AmountOfselectedCourses.value >= 1)

const clickFunc = {
  toSelectPlan() {
    if (store.courseAdmin.planOptions.length === 0) {
      store.updatePlanOptions()
    }
    store.courseAdmin.whetherShowSelectPlanDialog = true;
  },
  toEdit() {
    window.open(urls.admin.changeCourse(store.selectedCourses[0].course_id));
  },
  toCopy() {
    store.courseAdmin.operatingMode = 'Copy'
  },
  toCancelCopy() {
    clickFunc.toInitializeOperatingMode()
  },
  toCut() {
    store.courseAdmin.operatingMode = 'Cut'
  },
  toCancelCut() {
    clickFunc.toInitializeOperatingMode()
  },
  toDelete() {
    store.courseAdmin.operatingMode = 'Delete'
    store.courseAdmin.whetherShowDeletingDialog = true
  },
  toClearselectedCourses() {
    clickFunc.toInitializeOperatingMode()
    for (const cbi of store.courseAdmin.courseButtonInfos) {
      if (cbi.check) cbi.check = false
    }
  },
  toClearSelectedPlan() {
    store.courseAdmin.rawSelectedPlans = []
  },
  toInitializeOperatingMode() {
    store.courseAdmin.operatingMode = ''
  },
}
</script>

<template>
  <div class="FunctionButtonArea">
    <template v-if="whetherShowAddPlanButton">
      <el-button plain type="primary" :icon="CirclePlus" @click="clickFunc.toSelectPlan">选择教学计划</el-button>
      <template v-if="AmountOfSelectedPlan">
        <span>当前选择了{{ AmountOfSelectedPlan }}个教学计划</span>
        <el-button plain type="default" :icon="RefreshLeft" @click="clickFunc.toClearSelectedPlan()">取消选择</el-button>
      </template>
      <span v-else>如需添加课程，请先<strong>选择教学计划</strong></span>
    </template>

    <el-button plain type="default" v-if="whetherShowEditCourseButton" :icon="Edit" @click="clickFunc.toEdit()">编辑信息</el-button>

    <template v-if="whetherShowOtherCourseFunctionalButton">
      <el-button plain type="warning" :icon="DocumentCopy" @click="clickFunc.toCopy()" v-if="store.courseAdmin.operatingMode!=='Copy'">复制</el-button>
      <el-button plain type="primary" :icon="DocumentCopy" @click="clickFunc.toCancelCopy" v-else>取消复制</el-button>

      <el-button plain type="warning" :icon="Rank" @click="clickFunc.toCut()" v-if="store.courseAdmin.operatingMode!=='Cut'">调课</el-button>
      <el-button plain type="primary" :icon="Rank" @click="clickFunc.toCancelCut" v-else>取消调课</el-button>

      <el-button plain type="danger" :icon="Delete" @click="clickFunc.toDelete()">删除选中的{{ AmountOfselectedCourses }}节课程</el-button>
      <el-button plain type="default" :icon="RefreshLeft" @click="clickFunc.toClearselectedCourses()">清空选项</el-button>
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