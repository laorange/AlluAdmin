<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElOption} from "../../types/options";
import getWeeksString from "../../utils/getWeeksString";

// import {ElMessage} from "element-plus/es";  // build时会出问题

const apiToolkit = useApiToolkit();
const store = useCounterStore();
const route = useRoute()
const router = useRouter()

const multiple = {multiple: true}

const updateWeek = ref<boolean>(false)

const weekOptions = computed<ElOption[]>(() => {
  if (updateWeek.value) updateWeek.value = false
  let weekGroups: number[][] = [[]];
  for (let week = 1; week <= apiToolkit.maxWeek; week++) {
    if (weekGroups[weekGroups.length - 1].length < 5) {
      weekGroups[weekGroups.length - 1].push(week)
    } else {
      weekGroups.push([week])
    }
  }

  let weekOptions: ElOption[] = []
  for (const weekGroup of weekGroups) {
    let children: ElOption[] = weekGroup.map(week => {
      return {
        value: week,
        label: `第${week}周`
      }
    })
    weekOptions.push({
      value: (Math.floor((weekGroup[0] - 1) / 5) + 1),
      label: getWeeksString(weekGroup),
      children,
    })
  }
  return weekOptions
})

watch(() => store.rawSelectedWeeks, (newRawWeekSelected) => {
  updateWeek.value = true

  // 如果为空，则自动设置为当前周
  let newWeekSelected: number[] = Array.from(new Set(newRawWeekSelected.map(rw => rw[1])))
  newWeekSelected.sort((a: number, b: number) => a - b)
  // console.log('newWeekSelected', newWeekSelected)

  if (newWeekSelected.length === 0) {
    store.rawSelectedWeeks = [[Math.floor((apiToolkit.weekNow - 1) / 5) + 1, apiToolkit.weekNow]]
    store.alertInfo.info = `已自动设置为第${apiToolkit.weekNow}周`
  }

  // route.query
  if (newWeekSelected.length !== 0) {

    let weeksInQuery = store.selectedWeeks.length ? newWeekSelected.join(",") : undefined
    if (weeksInQuery !== route.query.weeks) {
      router.replace({
        name: String(route.name),
        query: {
          ...route.query,
          weeks: weeksInQuery
        }
      })
    }
  }
}, {deep: true})

const eventFunc = {
  toSelectAll() {
    let newRawSelectedWeek: [number, number][] = []
    for (let week = 1; week <= apiToolkit.maxWeek; week++) {
      newRawSelectedWeek.push([Math.floor((week - 1) / 5) + 1, week])
    }
    console.log("test")
    console.log(newRawSelectedWeek)
    store.rawSelectedWeeks = newRawSelectedWeek
  },
  toMakeSelectionsOpposite() {
    let newRawSelectedWeek: [number, number][] = []
    for (let week = 1; week <= apiToolkit.maxWeek; week++) {
      if (store.rawSelectedWeeks.map(rw => rw[1]).indexOf(week) === -1) {
        newRawSelectedWeek.push([Math.floor((week - 1) / 5) + 1, week])
      }
    }
    console.log("test")
    console.log(newRawSelectedWeek)
    store.rawSelectedWeeks = newRawSelectedWeek
  },
}
</script>

<template>
  <div class="TransferContainer">
    <div>
      <el-button-group>
        <el-button plain type="default" :icon="Finished" size="small"
                   @click="eventFunc.toSelectAll()">全选
        </el-button>
        <el-button plain type="default" :icon="Switch" size="small"
                   @click="eventFunc.toMakeSelectionsOpposite()">反选
        </el-button>
      </el-button-group>
    </div>

    <el-cascader-panel placeholder="(多选)请选择开课周数"
                       v-model="store.rawSelectedWeeks"
                       :show-all-levels="true"
                       :options="weekOptions"
                       :props="multiple"
                       clearable/>
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