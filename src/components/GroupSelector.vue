<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../store/counter";
import {computed, ref, watch} from "vue";
import {getSemesterOptionsByPeriod} from "../utils/getSemesterOptionsByPeriod";

interface ElOption {
  value: number,
  label: string,
  children?: ElOption[]
}

const multiple = {multiple: true}

const apiToolkit = useApiToolkit()
const store = useCounterStore()

const period = computed(() => apiToolkit.semesterConfig.first()?.current_period ?? 0)

const groupOptions = computed((): ElOption[] => {
  let _groupOptions: ElOption[] = getSemesterOptionsByPeriod(period.value);
  for (const group of apiToolkit.group.data) {
    let elOption = _groupOptions.filter(item => item.value === group.semester)
    if (elOption.length) {
      if (!elOption[0].children) {
        elOption[0].children = []
      }
      elOption[0].children.push({
        value: group.group_id,
        label: group.name,
      })
    }
  }
  return _groupOptions
})

watch(() => store.groupSelected, () => {
  store.semesterSelected = []
  for (const groupSelected of store.groupSelected) {
    if (store.semesterSelected.indexOf(groupSelected[0]) === -1) {
      store.semesterSelected.push(groupSelected[0])
    }
  }
}, {deep: true, immediate: true})

</script>

<template>
  <div class="GroupSelectorBody">
    <el-cascader-panel
        expandTrigger="hover"
        :options="groupOptions"
        :props="multiple"
        v-model="store.groupSelected"
    />
  </div>
</template>

<style scoped>
.el-cascader-panel {
  width: min-content;
}

.GroupSelectorBody {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
</style>