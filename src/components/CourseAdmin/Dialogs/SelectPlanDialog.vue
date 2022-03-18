<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../../store/counter";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {ElTreeOption} from "../../../types/courseAdmin";
// import * as element_plus from "element-plus";
import {CoursePlan} from "../../../types/api";

const apiToolkit = useApiToolkit();
const store = useCounterStore();


const multiple = {multiple: true}

const innerDrawerDataForOnePlan = reactive<{
  whetherShow: boolean,
  plan: CoursePlan | undefined
}>({
  whetherShow: false,
  plan: undefined
})

// const $Tree$SelectPlanDialog$CourseAdmin = ref()
//
// // watch(() => store.courseAdmin.planIdSelected, (newPlanIdSelected) => {
// //   // $Tree$SelectPlanDialog$CourseAdmin.value?.setCheckedNodes([])
// //   // newPlanIdSelected.reduce(
// //   //     (_, planId) => $Tree$SelectPlanDialog$CourseAdmin.value?.setChecked(planId, true, true) ?? undefined,
// //   //     undefined)
// //   console.log("watch", $Tree$SelectPlanDialog$CourseAdmin.value.getCheckedNodes());
// // }, {deep: true})
//
// function checkChangeFunc(option: ElTreeOption, selfChecked: boolean) {  // 第三个参数：childChecked: boolean
//   // 过滤掉一级节点的点击事件
//   console.log("checkChangeFunc", option, selfChecked)
//   console.log("$Tree$SelectPlanDialog$CourseAdmin", $Tree$SelectPlanDialog$CourseAdmin.value.getCheckedNodes());
//   if (option.id > 0 && store.courseAdmin.planIdSelected.indexOf(option.id)) {
//     // console.log(option, selfChecked ? '选中' : '取消选中')
//     if (selfChecked) {
//       store.courseAdmin.planIdSelected.push(option.id)
//     } else {
//       store.courseAdmin.planIdSelected = store.courseAdmin.planIdSelected.filter(planId => planId !== option.id)
//     }
//   }
// }

function nodeClickFunc(elTreeOption: ElTreeOption) {  // , treeNodeProps: unknown, event: Event
  // console.log(elTreeOption, treeNodeProps, event)
  if (elTreeOption.id > 0) {
    innerDrawerDataForOnePlan.whetherShow = true
    innerDrawerDataForOnePlan.plan = apiToolkit.coursePlan.filter(plan => plan.plan_id === elTreeOption.id)[0]
  }
}

watch(() => store.selectedSemesters, () => {
  store.updatePlanOptions()
}, {deep: true})

</script>

<template>

  <el-drawer
      v-model="store.courseAdmin.whetherShowSelectPlanDialog"
      title="请选择教学计划"
      size="50%"
      direction="ttb"
      :append-to-body="true"
  >
    <div class="SelectPlanDialog">
      <el-cascader-panel
          v-model="store.courseAdmin.rawSelectedPlans"
          :show-all-levels="true"
          :options="store.courseAdmin.planOptions"
          :props="multiple"
          clearable/>
      <!--        @check-change="checkChangeFunc"-->
    </div>

      <el-drawer
          v-model="innerDrawerDataForOnePlan.whetherShow"
          :title="innerDrawerDataForOnePlan.plan?.ch_name??'课程'"
          size="30%"
          :append-to-body="true"
      >
        <p v-if="innerDrawerDataForOnePlan.plan?.method">授课方式：{{ innerDrawerDataForOnePlan.plan?.method }}</p>
        <p v-if="innerDrawerDataForOnePlan.plan?.groups">分组: {{ apiToolkit.getNameOfGroups(innerDrawerDataForOnePlan.plan?.groups) }}</p>
        <p v-if="innerDrawerDataForOnePlan.plan?.teacher_name">授课教师：{{ innerDrawerDataForOnePlan.plan?.teacher_name }}</p>
      </el-drawer>

    <template #footer>
      <el-button @click="store.courseAdmin.whetherShowSelectPlanDialog = false" type="success">完成</el-button>
      <el-button @click="store.courseAdmin.rawSelectedPlans = []" type="default"
                 :disabled="store.courseAdmin.rawSelectedPlans.length===0">
        取消选中
      </el-button>
    </template>
  </el-drawer>

</template>

<style>
.SelectPlanDialog {
  display: flex;
  justify-content: center;
}
</style>