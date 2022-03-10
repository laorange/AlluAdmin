<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {computed} from "vue";

const apiToolkit = useApiToolkit();
const store = useCounterStore();
const maxWeek = computed(() => apiToolkit.semesterConfig.first()?.max_week)

interface OptionInElTransfer {
  value: number
  description: string
  disabled: boolean
}

const weekCandidates = computed(() => {
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

<style scoped>
.TransferContainer{
  width: min-content;
}
</style>