<script setup lang="ts">
import {useApiToolkit, useStore} from "../../../store/counter";
import {computed} from "vue";
import {Course} from "../../../types/api";
import {Delete} from "@element-plus/icons-vue";
import {getIsoWeekDay} from "../../../utils/dateUtils";
import dayjs from "dayjs";
import {SAME_SITE_AS_DJANGO} from "../../../utils/urls";
import {axiosDeleteCourse} from "../../../utils/axiosEditCourseMethods";
import {getFormalWhatDayString, getFormalWhichLessonString} from "../../../utils/commonUtils";

const store = useStore();
const apiToolkit = useApiToolkit();

const description = computed<string>(() => {
  switch (store.courseAdmin.operatingMode) {
    case "Cut":
      return "调课清单"
    default: // Delete
      return "删除清单"
  }
})

const courseOperating = computed<Course[]>(() => store.selectedCourses)

const eventFunc = {
  letOneCourseSelectedSurvive(courseId: number) {
    for (const cbi of store.courseAdmin.courseButtonInfos) {
      if (cbi.course.course_id === courseId) {
        cbi.check = false
      }
    }
    if (store.selectedCourses.length === 0) {
      store.courseAdmin.whetherShowDeletingDialog = false
      store.courseAdmin.operatingMode = ""
    }
  },
  clickCancelButton() {
    store.courseAdmin.whetherShowDeletingDialog = false
  },
  submit() {
    console.log("提交了信息", "formInfos")
    if (store.courseAdmin.operatingMode === "Cut") {
      store.courseAdmin.whetherShowDeletingDialog = false;
      store.courseAdmin.whetherShowAddingDialog = true;
    } else {
      store.courseAdmin.whetherShowAddingDialog = false;
      if (SAME_SITE_AS_DJANGO) {
        for (const course of courseOperating.value) {
          axiosDeleteCourse(course.course_id, () => undefined)
        }
        store.isLoading = true
        store.alertInfo.success = "提交成功，页面将于3秒后自动刷新";
        setTimeout(() => location.reload(), 3000)
      } else {
        store.alertInfo.success = "提交成功(预览模式不会产生实际效果)";
      }
    }
  },
}
</script>

<template>
  <ElDrawer
      v-model="store.courseAdmin.whetherShowDeletingDialog"
      :title="description"
      size="90%"
      direction="rtl"
      :append-to-body="true"
  >
    <div class="FormSetDiv">
      <div class="FormDiv">
        <div>日期</div>
        <div>第?周</div>
        <div>星期?</div>
        <div>第?节课</div>
        <div>课程名</div>
        <div>授课方式</div>
        <div>授课教师</div>
        <div>分组</div>
        <div>教室</div>
        <div class="FormNote">备注</div>
        <el-icon></el-icon>
      </div>
      <div class="FormDiv" v-for="course in courseOperating">
        <div>{{ course.date }}</div>
        <div>第{{ apiToolkit.getWeekOfOneCourse(course) }}周</div>
        <div>{{ getFormalWhatDayString(getIsoWeekDay(dayjs(course.date))) }}</div>
        <div>{{ `${getFormalWhichLessonString(course.which_lesson)}` }}</div>
        <div>{{ course.ch_name }}</div>
        <div>{{ course.method }}</div>
        <div>{{ course.teacher_name ? course.teacher_name : "" }}</div>
        <div>{{ course.group_ids ? apiToolkit.getGroupNameOfCourse(course) : "" }}</div>
        <div>{{ course.room ? course.room_name : "" }}</div>
        <div class="FormNote">{{ course.note ? course.note : "" }}</div>

        <el-icon @click="eventFunc.letOneCourseSelectedSurvive(course.course_id)">
          <delete/>
        </el-icon>
      </div>
    </div>

    <template #footer>
      <el-button @click="eventFunc.submit" type="primary" v-if="store.courseAdmin.operatingMode === 'Cut'">确认调课</el-button>
      <el-button @click="eventFunc.submit" type="danger" v-else>确认删除</el-button>
      <el-button @click="eventFunc.clickCancelButton" type="default">取消</el-button>
    </template>
  </ElDrawer>
</template>

<style scoped>
.el-drawer__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-drawer__body > div {
  margin: 5px 0;
  text-align: center;
}

.FormSetDiv {
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
  flex: 1;
}

.FormDiv .el-icon {
  margin-left: 5px;
  cursor: pointer;
}

.FormDiv .el-icon:hover {
  color: red;
}
</style>