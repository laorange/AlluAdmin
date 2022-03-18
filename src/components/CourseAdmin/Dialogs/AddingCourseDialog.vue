<script setup lang="ts">

import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {ref, computed, watch} from "vue";
import {CoursePlan} from "../../../types/api";
import {CourseInfoContainer} from "../../../utils/ApiDataHandlers/CourseInfoHandler";
import {Delete} from "@element-plus/icons-vue";
import WeekSelectBar from "../WeekSelectBar.vue";


const store = useCounterStore();
const apiToolkit = useApiToolkit();

const whatDayList = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]

const description = computed<string>(() => {
  switch (store.courseAdmin.operatingMode) {
    case "Copy":
      return "复制清单"
    case "Cut":
      return "调课清单"
    default:
      return "排课清单"
  }
})

const planIdOperating = computed<number[]>(() => {
  if (store.courseAdmin.operatingMode === "") {
    //  Mode为“”，是按教学计划添加
    return store.selectedPlans
  } else {
    //  其他情况：Mode为“Copy“或”Cut”，是按选择的课程对应的教学计划添加
    return store.courseAdmin.courseIdSelected.map((courseId) => apiToolkit.course.filter(course => course.course_id === courseId)[0]?.plan)
  }
})

const planOperating = computed<CoursePlan[]>(() => apiToolkit.coursePlan.filter(plan => planIdOperating.value.indexOf(plan.plan_id) > -1))

interface formInfoContainer {
  plan: CoursePlan,
  note: string,
  classroomId: number | undefined
}


const formInfos = ref<formInfoContainer[]>([])
watch(() => planOperating.value, () => {
  formInfos.value = planOperating.value.map((plan: CoursePlan) => {
    return {
      plan: plan,
      note: "",
      classroomId: undefined
    }
  })
}, {deep: true, immediate: true})


const filteredInfoContainers = computed<CourseInfoContainer[]>(() =>
    apiToolkit.filter__infosByWeek_WhatDay_WhichLesson(store.courseAdmin.whatDay, store.courseAdmin.whichLesson))

const occupiedClassroomIds = computed<number[]>(() => {
  let occupiedClassroomIds: number[] = []
  for (const ic of filteredInfoContainers.value) {
    for (const pc of ic.coursePlans) {
      for (const course of pc.courses) {
        if (course.room) occupiedClassroomIds.push(course.room)
      }
    }
  }
  for (const formInfo of formInfos.value) {
    if (formInfo.classroomId && occupiedClassroomIds.indexOf(formInfo.classroomId) === -1) {
      occupiedClassroomIds.push(formInfo.classroomId)
    }
  }
  return occupiedClassroomIds
})

const whetherCanSubmit = computed<boolean>(() => {
  if (formInfos.value.length === 0) return false
  for (const formInfo of formInfos.value) {
    if (formInfo.classroomId === undefined) return false
  }
  return true
})

const eventFunc = {
  deleteSelectedPlan(planId: number) {
    store.courseAdmin.rawSelectedPlans = store.courseAdmin.rawSelectedPlans.filter(rp => planId !== rp[1])
    if (store.courseAdmin.rawSelectedPlans.length === 0) {
      store.courseAdmin.whetherShowAddingDialog = false
      store.courseAdmin.operatingMode = ""
    }
  },
  clickCancelButton() {
    store.courseAdmin.whetherShowAddingDialog = false
  },
  clickReselectPlanButton() {
    store.courseAdmin.rawSelectedPlans = []
    store.courseAdmin.whetherShowAddingDialog = false
    store.courseAdmin.whetherShowSelectPlanDialog = true
  },
  submit() {
    alert("提交了信息")
    console.log("formInfos", formInfos);
    store.courseAdmin.whetherShowAddingDialog = false
    store.courseAdmin.operatingMode = ""
  },
}
</script>

<template>
  <div class="AddingCourseDialog">
    <ElDrawer
        v-model="store.courseAdmin.whetherShowAddingDialog"
        :title="description"
        size="75%"
        direction="rtl"
        :append-to-body="true"
    >
      <div class="PreparingInfoArea">
        <div>{{ whatDayList[store.courseAdmin.whatDay - 1] }}
          &nbsp;&nbsp;&nbsp;&nbsp;
          {{ `第${store.courseAdmin.whichLesson * 2 - 1}、${store.courseAdmin.whichLesson * 2}节课` }}
        </div>
        <div>请选择需要添加到哪些周: {{ store.getWeeksString() }}</div>
        <week-select-bar></week-select-bar>
      </div>

      <div class="FormSetDiv">
        <div class="FormDiv">
          <div>课程名</div>
          <div>授课方式</div>
          <div>授课教师</div>
          <div>分组</div>
          <div>教室</div>
          <div class="FormNote">备注</div>
          <el-icon></el-icon>
        </div>
        <div class="FormDiv" v-for="formInfo in formInfos">
          <div>{{ formInfo.plan.ch_name }}</div>
          <div>{{ formInfo.plan.method }}</div>
          <div>{{ formInfo.plan.teacher ? formInfo.plan.teacher_name : "" }}</div>
          <div>{{ formInfo.plan.groups.length ? apiToolkit.getNameOfGroups(formInfo.plan.groups) : "" }}</div>
          <div>
            <el-select v-model="formInfo.classroomId" placeholder="选择教室">
              <el-option
                  v-for="room in apiToolkit.classroom.data"
                  :key="room.room_id"
                  :label="room.name"
                  :value="room.room_id"
                  :disabled="occupiedClassroomIds.indexOf(room.room_id)>-1"
              />
            </el-select>
          </div>
          <div class="FormNote">
            <el-input v-model="formInfo.note" placeholder="备注(选填)"/>
          </div>

          <el-icon @click="eventFunc.deleteSelectedPlan(formInfo.plan.plan_id)">
            <delete/>
          </el-icon>
        </div>
      </div>

      <template #footer>
        <el-button @click="eventFunc.submit" :disabled="!whetherCanSubmit" type="success">确认添加</el-button>
        <el-button @click="eventFunc.clickCancelButton" type="default">取消</el-button>
        <el-button @click="eventFunc.clickReselectPlanButton" type="primary">重新选择教学计划</el-button>
      </template>
    </ElDrawer>
  </div>
</template>

<style scoped>
.el-drawer__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-drawer__body > * {
  margin: 5px 0;
  text-align: center;
}

.PreparingInfoArea > *{
  margin: 5px 0;
}

.FormSetDiv, .PreparingInfoArea {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}

.FormDiv {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  text-align: center;
}

.FormDiv > div {
  flex: 1;
  margin: 5px 1px;
}

.FormDiv:first-child {
  margin-top: 15px;
  border-top: #000033 dashed 1px;
}

.FormDiv:last-child {
  margin-bottom: 15px;
  border-bottom: #000033 dashed 1px;
}

.FormDiv div.FormNote {
  flex: 2;
}

.FormDiv .el-icon {
  margin-left: 5px;
  cursor: pointer;
}

.FormDiv .el-icon:hover {
  color: red;
}
</style>