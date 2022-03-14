<script setup lang="ts">
import {useCounterStore} from "../../store/counter";
import {computed, ref} from "vue";

import {Delete, CirclePlus, DocumentCopy, Scissor, Edit} from "@element-plus/icons-vue";

const store = useCounterStore();

const AmountOfSelectedPlan = computed<number>(() => store.courseAdmin.planIdSelected.length)
// const AmountOfSelectedCourse = ref<number>(0)
const AmountOfSelectedCourse = computed<number>(() => store.courseAdmin.courseIdSelected.length)

const whetherShowAddPlanButton = computed<boolean>(() => AmountOfSelectedCourse.value == 0)
const whetherShowEditCourseButton = computed<boolean>(() => AmountOfSelectedCourse.value == 1)
const whetherShowOtherCourseFunctionalButton = computed<boolean>(() => AmountOfSelectedCourse.value >= 1)

</script>

<template>
  <div class="FunctionButtonArea">
    <template v-if="whetherShowAddPlanButton">
      <el-button plain type="primary" :icon="CirclePlus">选择教学计划</el-button>
      <span v-if="AmountOfSelectedPlan">当前选择了{{ AmountOfSelectedPlan }}个教学计划</span>
      <span v-else>如需添加课程，请先<strong>选择教学计划</strong></span>
    </template>

    <el-button plain type="primary" v-if="whetherShowEditCourseButton" :icon="Edit">编辑信息</el-button>

    <template v-if="whetherShowOtherCourseFunctionalButton">
      <el-button plain type="warning" :icon="DocumentCopy">复制</el-button>
      <el-button plain type="warning" :icon="Scissor">调课</el-button>
      <el-button plain type="danger" :icon="Delete">删除选中的{{ AmountOfSelectedCourse }}节课程</el-button>
    </template>
  </div>
</template>

<style scoped>
.FunctionButtonArea {
  background-color: #efefef;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.FunctionButtonArea > * {
  margin: 5px;
}
</style>