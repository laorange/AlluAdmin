<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../store/counter";
import {computed, watch} from "vue";
import {getSemesterOptionsByPeriod, SemesterOption} from "../utils/getSemesterOptionsByPeriod";
import {useRoute, useRouter} from "vue-router";


const store = useCounterStore()
const apiToolkit = useApiToolkit()
const route = useRoute()
const router = useRouter()

const period = computed(() => apiToolkit.semesterConfig.first()?.current_period ?? 0)
const gradeSelectOptions = computed((): SemesterOption[] => getSemesterOptionsByPeriod(period.value))

// // region 读取route.query中的semester并赋值在store中，如果无效则置0
// const semesterInQuery = parseInt(String(route.query.semester ?? 0))
// if (gradeSelectOptions.value.filter((option) => option.value === semesterInQuery).length) {
//   store.semesterSelected = semesterInQuery;
// } else {
//   store.semesterSelected = 0;
// }
// // endregion

// region 监视：如果选择新的年级，同步变化到route.query
watch(() => store.semesterSelected, (newValue) => {
  router.push({
    name: String(route.name),
    query: {
      ...route.query,
      semester: newValue
    }
  })
}, {immediate: true})
// endregion
</script>

<template>
  <el-select v-model="store.semesterSelected" placeholder="选择年级">
    <el-option
        v-for="(gradeOption,index) in gradeSelectOptions"
        :key="index"
        :label="gradeOption.label"
        :value="gradeOption.value"
    >
    </el-option>
  </el-select>
</template>

<style scoped>
.el-select {
  width: 120px;
}
</style>