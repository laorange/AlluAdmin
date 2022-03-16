<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {ElTreeOption} from "../../../types/courseAdmin";
import {computed, reactive, ref, watch} from "vue";
import {Course} from "../../../types/api";
import {CourseInfoContainer, CoursePlanContainer} from "../../../utils/ApiDataHandlers/CourseInfoHandler";

import {Plus, DocumentCopy, Rank} from "@element-plus/icons-vue";

const timetableHeight = '180px'

const props = defineProps<{ whatDay: number, whichLesson: number }>()

const filteredInfoContainers = computed<CourseInfoContainer[]>(() =>
    apiToolkit.filter__infosByWeek_WhatDay_WhichLesson(props.whatDay, props.whichLesson))

const elTreeOptionIndicator = {
  label: 'label',
  children: 'children',
}

const apiToolkit = useApiToolkit()
const store = useCounterStore()

const innerDrawerDataForOneCourse = reactive<{
  whetherShow: boolean,
  course: Course | undefined
}>({
  whetherShow: false,
  course: undefined
})

function parseGroupIdsOfCourse(course: Course) {
  let groups = JSON.parse(course?.group_ids ?? '') as number[]
  return apiToolkit.getNameOfGroups(groups)
}

const elTreeOptions = computed<ElTreeOption[]>(() => {
  let result: ElTreeOption[] = []

  for (const ic of filteredInfoContainers.value) {
    let childOptions: ElTreeOption[] = ic.coursePlans.reduce((result: ElTreeOption[], pc: CoursePlanContainer) => {
      return result.concat(pc.courses.reduce((innerR: ElTreeOption[], course: Course) => innerR.concat({
        id: course.course_id,
        label: [course.method ?? '', parseGroupIdsOfCourse(course)].join(' ')
      }), []))
    }, [])

    let parentOption: ElTreeOption = {
      id: -ic.courseInfo.info_id,
      label: ic.courseInfo.ch_name,
      children: childOptions
    }

    result.push(parentOption)
  }
  return result
})

const $Tree$TimeTableBlock$CourseAdmin = ref()

watch(() => store.courseAdmin.courseIdSelected, (newCourseIdSelected: number[]) => {
  if (elTreeOptions.value.length > 0) {
    $Tree$TimeTableBlock$CourseAdmin.value?.setCheckedNodes([])
    newCourseIdSelected.reduce(
        (_, courseId) => $Tree$TimeTableBlock$CourseAdmin.value?.setChecked(courseId, true, true),
        undefined)
  }
}, {deep: true})

function checkChangeFunc(option: ElTreeOption, selfChecked: boolean) {  // 第三个参数：childChecked: boolean
  // 过滤掉一级节点的点击事件
  if (option.id > 0) {
    // console.log(option, selfChecked ? '选中' : '取消选中')
    if (selfChecked) {
      store.courseAdmin.courseIdSelected.push(option.id)
    } else {
      store.courseAdmin.courseIdSelected = store.courseAdmin.courseIdSelected.filter(courseId => courseId !== option.id)
    }
  }
}

function nodeClickFunc(elTreeOption: ElTreeOption) { // 另外俩参数：, treeNodeProps: unknown, event: Event
  if (elTreeOption.id > 0) {
    innerDrawerDataForOneCourse.whetherShow = true
    innerDrawerDataForOneCourse.course = apiToolkit.course.filter(course => course.course_id === elTreeOption.id)[0]
  }
}

// region button
const canAdd = computed<boolean>(() =>
    store.courseAdmin.operatingMode === '' &&
    store.courseAdmin.courseIdSelected.length === 0 &&
    store.courseAdmin.planIdSelected.length > 0
)

const canCopy = computed<boolean>(() =>
    store.courseAdmin.operatingMode === 'Copy' &&
    store.courseAdmin.courseIdSelected.length > 0
)

const canCut = computed<boolean>(() =>
    store.courseAdmin.operatingMode === 'Cut' &&
    store.courseAdmin.courseIdSelected.length > 0
)
// endregion

</script>

<template>
  <el-scrollbar :height="timetableHeight">
    <div class="TimetableBlock">
      <el-button plain type="primary" :icon="Plus" size="small" v-if="canAdd"
                 @click="">在此排课
      </el-button>
      <el-button plain type="success" :icon="DocumentCopy" size="small" v-if="canCopy"
                 @click="">粘贴至此
      </el-button>
      <el-button plain type="warning" :icon="Rank" size="small" v-if="canCut"
                 @click="">调课至此
      </el-button>

      <el-tree
          :data="elTreeOptions"
          show-checkbox
          node-key="id"
          :props="elTreeOptionIndicator"
          ref="$Tree$TimeTableBlock$CourseAdmin"
          empty-text=""
          @check-change="checkChangeFunc"
          @node-click="nodeClickFunc"
          :render-after-expand="false"
      />

      <el-drawer
          v-model="innerDrawerDataForOneCourse.whetherShow"
          :title="innerDrawerDataForOneCourse.course?.ch_name??'课程'"
          size="30%"
          :append-to-body="true"
      >
        <p v-if="innerDrawerDataForOneCourse.course">{{ `第${apiToolkit.getWeekOfOneCourse(innerDrawerDataForOneCourse.course)}周` }}</p>
        <p v-if="innerDrawerDataForOneCourse.course?.method">授课方式：{{ innerDrawerDataForOneCourse.course?.method }}</p>
        <p v-if="innerDrawerDataForOneCourse.course?.group_ids">分组: {{ parseGroupIdsOfCourse(innerDrawerDataForOneCourse.course) }}</p>
        <p v-if="innerDrawerDataForOneCourse.course?.teacher_name">授课教师：{{ innerDrawerDataForOneCourse.course?.teacher_name }}</p>
      </el-drawer>
    </div>
  </el-scrollbar>
</template>

<style scoped>
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