<script setup lang="ts">
import {useApiToolkit, useStore} from "../../../store/counter";
import {computed} from "vue";
import CourseCard from "../../CourseCard.vue";

import {CoursePlan, WhatDay, WhichLesson} from "../../../types/api";
import {CourseInfoContainer} from "../../../utils/ApiDataHandlers/CourseInfoHandler";

import {Plus, DocumentCopy, Rank, Search} from "@element-plus/icons-vue";
import {getFormalWhatDayString, getFormalWhichLessonString, whetherTwoArraysHaveSameElement} from "../../../utils/commonUtils";
import {ElOption} from "../../../types/options";

const apiToolkit = useApiToolkit()
const store = useStore()

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
  openDrawer() {
    store.courseAdmin.whatDay = props.whatDay as WhatDay
    store.courseAdmin.whichLesson = props.whichLesson as WhichLesson
    store.courseAdmin.dataOfTimetableBlockDetailDialog.filteredInfoContainers = filteredInfoContainers.value
    store.courseAdmin.dataOfTimetableBlockDetailDialog.whetherShow = true
  }
}

const occupiedPlans = computed<CoursePlan[]>(() => {
  return allGroupFilteredInfoContainers.value.reduce((result: CoursePlan[], ic) => result.concat(ic.coursePlans.map(pc => pc.coursePlan)), [])
})

const plansOfSelectedCourses = computed<CoursePlan[]>(() =>
    apiToolkit.coursePlan.filter(plan => store.selectedCourses.map(c => c.plan).indexOf(plan.plan_id) > -1))
const selectedPlans = computed<CoursePlan[]>(() =>
    apiToolkit.coursePlan.filter(plan => store.selectedPlanIds.indexOf(plan.plan_id) > -1))

// region 判断待操作的Plan是否和已有的Plan冲突
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
// endregion

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

function whetherThisInfoHasSelectedCourse(ic: CourseInfoContainer): boolean {
  for (const pc of ic.coursePlans) {
    if (pc.courses.filter(course => store.selectedCourses.map(sc => sc.course_id).indexOf(course.course_id) > -1).length > 0) {
      return true
    }
  }
  return false
}
</script>

<template>
  <el-scrollbar :height="timetableHeight">
    <div class="TimetableBlock">
      <!-- region 功能按键 -->
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
      <!--endregion-->

      <!-- 课程数量比较少的时候，直接显示按键 -->
      <template v-if="filteredCourseIds.length <= 6">
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
      </template>

      <div class="SituationThatThereAreTooManyCourses" v-else>
        <el-button plain type="default" :icon="Search" size="small"
                   @click="eventFunc.openDrawer()">查看详情
        </el-button>

        <div
            v-for="ic in filteredInfoContainers"
            :key="ic.courseInfo.info_id"
            class="CourseInfoChName"
            :style="{color: whetherThisInfoHasSelectedCourse(ic) ? 'red' : 'black' }"
        >
          {{ ic.courseInfo.ch_name }}
        </div>
      </div>
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

.SituationThatThereAreTooManyCourses {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-content: center;
}

.CourseInfoChName {
  text-align: center;
  margin: 3px 0;
  font-size: 12px;
}
</style>