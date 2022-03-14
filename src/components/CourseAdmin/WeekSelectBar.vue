<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const apiToolkit = useApiToolkit();
const store = useCounterStore();
const route = useRoute()
const router = useRouter()

const maxWeek = computed<number>(() => apiToolkit.maxWeek)

interface OptionInElTransfer {
  value: number
  description: string
  disabled: boolean
}

// 定义一个响应式变量weekSelecting，在weekCandidates的computed中使用，以在weekSelected变化时更新weekCandidates
let weekSelecting = ref<boolean>(false)

const weekCandidates = computed<OptionInElTransfer[]>(() => {
  if (weekSelecting.value) {
    weekSelecting.value = false
  }
  let candidates: OptionInElTransfer[] = [];
  for (let week = 1; week <= maxWeek.value; week++) {
    candidates.push({
      value: week,
      description: `第${week}周`,
      disabled: false
    })
  }
  return candidates
})

// region 监视：如果选择新的年级，同步变化到groupSelected和route.query
watch(() => store.courseAdmin.weekSelected, (newWeekSelected) => {
  weekSelecting.value = true

  // route.query
  router.replace({
    name: String(route.name),
    query: {
      ...route.query,
      weeks: newWeekSelected.length ? Array.from(new Set(newWeekSelected)).join(",") : undefined
    }
  })
}, {deep: true})
// endregion

</script>

<template>
  <div class="TransferContainer">
    <el-transfer
        v-model="store.courseAdmin.weekSelected"
        :props="{key: 'value', label: 'description'}"
        :data="weekCandidates"
        :titles="['待选', '已选']"
    ></el-transfer>
  </div>
</template>

<style>
.TransferContainer {
  width: max-content;
}

.MinContentTransferContainer {
  width: min-content;
}

.el-transfer__buttons {
  padding: 0 5px;
}
</style>