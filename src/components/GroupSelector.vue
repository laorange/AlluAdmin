<script setup lang="ts">
import {useApiToolkit, useStore} from "../store/counter";
import {computed, ref, watch} from "vue";
import {getSemesterOptionsByPeriod} from "../utils/getSemesterOptionsByPeriod";
import {useRoute, useRouter} from "vue-router";
import {ElOption} from "../types/options";

// import {Finished, Switch} from "@element-plus/icons-vue";

const multiple = {multiple: true}

const apiToolkit = useApiToolkit()
const store = useStore()
const route = useRoute()
const router = useRouter()

const period = computed<number>(() => apiToolkit.period)

// region 定义一个响应式变量groupSelecting，在groupOptions的computed中使用，以在GroupSelected变化时更新groupOptions
let groupSelecting = ref<boolean>(false)

const groupOptions = computed<ElOption[]>(() => {
  if (groupSelecting.value) {
    groupSelecting.value = false
  }
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
// endregion

// region 监视：如果选择新的年级，同步变化到groupSelected和route.query
watch(() => store.rawSelectedGroups, (newGroupSelected) => {
  groupSelecting.value = true
  let groupIds: number[] = newGroupSelected.map(gs => gs[1])

  // route.query
  router.replace({
    name: String(route.name),
    query: {
      ...route.query,
      groups: groupIds.length ? Array.from(new Set(groupIds)).join(",") : undefined
    }
  })
}, {deep: true})
// endregion
</script>

<template>
  <div class="GroupSelectorBody">
    <el-cascader-panel
        expandTrigger="hover"
        :options="groupOptions"
        :props="multiple"
        v-model="store.rawSelectedGroups"
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