<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {computed} from "vue";
import CourseCard from "../../CourseCard.vue";

import {WhatDay, WhichLesson} from "../../../types/api";
import {CourseInfoContainer} from "../../../utils/ApiDataHandlers/CourseInfoHandler";

import {Plus, DocumentCopy, Rank, Finished, Switch} from "@element-plus/icons-vue";

const apiToolkit = useApiToolkit()
const store = useCounterStore()

const timetableHeight = '180px'

const props = defineProps<{ whatDay: number, whichLesson: number }>()

const filteredInfoContainers = computed<CourseInfoContainer[]>(() =>
    apiToolkit.filter__infosByWeek_WhatDay_WhichLesson(props.whatDay, props.whichLesson))

const filteredCourseIds = computed<number[]>(() => {
  let filteredCourseIds: number[] = []
  for (const ic of filteredInfoContainers.value) {
    for (const pc of ic.coursePlans) {
      filteredCourseIds = filteredCourseIds.concat(pc.courses.map(course => course.course_id))
    }
  }
  return filteredCourseIds
})


const eventFunc = {
  setWhatDayWhichLesson() {
    store.courseAdmin.whatDay = props.whatDay as WhatDay
    store.courseAdmin.whichLesson = props.whichLesson as WhichLesson
  },
  toAddHere() {
    eventFunc.setWhatDayWhichLesson();
    store.courseAdmin.whetherShowAddingDialog = true
  },
  toCopyHere() {
    eventFunc.toAddHere()
  },
  toCutHere() {
    eventFunc.setWhatDayWhichLesson();
    store.courseAdmin.whetherShowDeletingDialog = true  // 先请用户确定是否要删除原有课程
  },
  toSelectAll() {
    for (const courseButtonInfo of store.courseAdmin.courseButtonInfos) {
      if (filteredCourseIds.value.indexOf(courseButtonInfo.course.course_id) > -1) {
        courseButtonInfo.check = true
      }
    }
  },
  toMakeSelectionsOpposite() {
    for (const courseButtonInfo of store.courseAdmin.courseButtonInfos) {
      if (filteredCourseIds.value.indexOf(courseButtonInfo.course.course_id) > -1) {
        courseButtonInfo.check = !courseButtonInfo.check
      }
    }
  },
}

// region button
const canAdd = computed<boolean>(() =>
    store.courseAdmin.operatingMode === '' &&
    store.selectedCourses.length === 0 &&
    store.courseAdmin.rawSelectedPlans.length > 0
)

const canCopy = computed<boolean>(() =>
    store.courseAdmin.operatingMode === 'Copy' &&
    store.selectedCourses.length > 0
)

const canCut = computed<boolean>(() =>
    store.courseAdmin.operatingMode === 'Cut' &&
    store.selectedCourses.length > 0
)

// endregion


const placementName = computed(() => {
  return props.whatDay <= 4 ? "right" : "left"
})
</script>

<template>
  <el-scrollbar :height="timetableHeight">
    <div class="TimetableBlock">
      <div class="TwoButtonsArea">
        <el-button plain type="default" :icon="Finished" size="small" v-if="filteredCourseIds.length >= 2"
                   @click="eventFunc.toSelectAll">全选
        </el-button>
        <el-button plain type="default" :icon="Switch" size="small" v-if="filteredCourseIds.length >= 2"
                   @click="eventFunc.toMakeSelectionsOpposite">反选
        </el-button>
      </div>

      <el-button plain type="primary" :icon="Plus" size="small" v-if="canAdd"
                 @click="eventFunc.toAddHere">在此排课
      </el-button>
      <el-button plain type="success" :icon="DocumentCopy" size="small" v-if="canCopy"
                 @click="eventFunc.toCopyHere">粘贴至此
      </el-button>
      <el-button plain type="warning" :icon="Rank" size="small" v-if="canCut"
                 @click="eventFunc.toCutHere">调课至此
      </el-button>

      <template v-for="courseButtonInfo in store.courseAdmin.courseButtonInfos">
        <div v-if="filteredCourseIds.indexOf(courseButtonInfo.course.course_id) > -1">
          <el-tooltip
              class="box-item"
              effect="light"
              :placement="placementName"
          >
            <template #content>
              <course-card :course="courseButtonInfo.course"></course-card>
            </template>
            <div>
              <el-checkbox
                  v-model="courseButtonInfo.check" :label="courseButtonInfo.course.ch_name" size="small"></el-checkbox>
            </div>
          </el-tooltip>
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.TwoButtonsArea {
  display: flex;
  width: 100%;
}

.TwoButtonsArea > * {
  flex: 1;
}

.TimetableBlock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: xx-small;
}

.TimetableBlock .el-button {
  align-self: center;
  width: 80%;
}

.TimetableBlock .el-button + .el-button {
  margin: 0;
}

.el-tree {
  background-color: transparent;
  width: 100%;
}

.el-tree-node, .el-tree-node__children {
  width: max-content;
}
</style>