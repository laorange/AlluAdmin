<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {computed} from "vue";
import CourseCard from "../../CourseCard.vue";

import {CoursePlan, WhatDay, WhichLesson} from "../../../types/api";
import {CourseInfoContainer} from "../../../utils/ApiDataHandlers/CourseInfoHandler";

import {Plus, DocumentCopy, Rank, Finished, Switch} from "@element-plus/icons-vue";
import {getFormalWhatDayString, getFormalWhichLessonString, whetherTwoArraysHaveSameElement} from "../../../utils/commonUtils";

const apiToolkit = useApiToolkit()
const store = useCounterStore()

const timetableHeight = '180px'

const props = defineProps<{ whatDay: number, whichLesson: number }>()

// 对Group、Week、WhatDay和WhichLesson进行过滤
const filteredInfoContainers = computed<CourseInfoContainer[]>(() =>
    apiToolkit.filter__infosByWhatDayAndWhichLesson(props.whatDay, props.whichLesson))

// 只对Week、WhatDay和WhichLesson进行过滤
const allGroupFilteredInfoContainers = computed<CourseInfoContainer[]>(() =>
    apiToolkit.filter__infosByWhatDayAndWhichLesson(props.whatDay, props.whichLesson, apiToolkit.filter_infosByWeek))

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

const occupiedPlans = computed<CoursePlan[]>(() => {
  return allGroupFilteredInfoContainers.value.reduce((result: CoursePlan[], ic) => result.concat(ic.coursePlans.map(pc => pc.coursePlan)), [])
})

const plansOfSelectedCourses = computed<CoursePlan[]>(() =>
    apiToolkit.coursePlan.filter(plan => store.selectedCourses.map(c => c.plan).indexOf(plan.plan_id) > -1))
const selectedPlans = computed<CoursePlan[]>(() =>
    apiToolkit.coursePlan.filter(plan => store.selectedPlanIds.indexOf(plan.plan_id) > -1))

// 判断待操作的Plan是否和已有的Plan冲突
function judgeWhetherThereIsConflict(occupiedPlans: CoursePlan[], candidatePlans: CoursePlan[]): boolean {
  if (whetherTwoArraysHaveSameElement(candidatePlans.map(p => p.plan_id),
      occupiedPlans.map(p => p.plan_id))) {
    return true
  } else if (whetherTwoArraysHaveSameElement(candidatePlans.map(p => p.teacher), occupiedPlans.map(p => p.teacher))) {
    return true
  } else if (whetherTwoArraysHaveSameElement(
      candidatePlans.map(p => p.groups).reduce((result: number[], groups) => result.concat(groups), []),
      occupiedPlans.map(p => p.groups).reduce((result: number[], groups) => result.concat(groups), []))) {
    return true
  }
  return false;
}

const whetherSelectedCoursesConflictWithExistingPlans = computed<boolean>(() =>
    judgeWhetherThereIsConflict(occupiedPlans.value, plansOfSelectedCourses.value))

const whetherSelectedPlansConflictWithExistingPlans = computed<boolean>(() =>
    judgeWhetherThereIsConflict(occupiedPlans.value, selectedPlans.value))

// region button
const canAdd = computed<boolean>(() =>
    store.courseAdmin.operatingMode === '' &&
    store.selectedCourses.length === 0 &&
    store.selectedPlanIds.length > 0
    && !whetherSelectedPlansConflictWithExistingPlans.value
)

const canCopy = computed<boolean>(() =>
    store.courseAdmin.operatingMode === 'Copy' &&
    store.selectedCourses.length > 0
    && !whetherSelectedCoursesConflictWithExistingPlans.value
)

const canCut = computed<boolean>(() =>
    store.courseAdmin.operatingMode === 'Cut' &&
    store.selectedCourses.length > 0
    && !whetherSelectedCoursesConflictWithExistingPlans.value
)

// endregion


const placementName = computed(() => {
  return props.whatDay <= 4 ? "right" : "left"
})

const timetableInfo = computed<string>(() => {
  return `${getFormalWhatDayString(props.whatDay)} ${getFormalWhichLessonString(props.whichLesson)}`
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

      <el-tooltip
          class="box-item"
          effect="light"
          :placement="placementName"
      >
        <template #content>
          <h2 class="tooltipH2">{{ store.weeksString }}</h2>
          <h2 class="tooltipH2">{{ timetableInfo }}</h2>
        </template>

        <el-button plain type="primary" :icon="Plus" size="small" v-if="canAdd"
                   @click="eventFunc.toAddHere">在此排课
        </el-button>
        <el-button plain type="success" :icon="DocumentCopy" size="small" v-if="canCopy"
                   @click="eventFunc.toCopyHere">粘贴至此
        </el-button>
        <el-button plain type="warning" :icon="Rank" size="small" v-if="canCut"
                   @click="eventFunc.toCutHere">调课至此
        </el-button>
        <div style="display: none"></div>
      </el-tooltip>

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

.tooltipH2 {
  text-align: center;
}

.el-tree {
  background-color: transparent;
  width: 100%;
}

.el-tree-node, .el-tree-node__children {
  width: max-content;
}
</style>