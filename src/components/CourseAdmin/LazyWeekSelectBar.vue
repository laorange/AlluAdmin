<script setup lang="ts">
import {useApiToolkit, useCounterStore} from "../../store/counter";
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

// import {ElMessage} from "element-plus/es";  // build时会出问题

import {Finished, Switch, Select, RefreshLeft, Coin, Scissor} from "@element-plus/icons-vue";

const apiToolkit = useApiToolkit();
const store = useCounterStore();
const route = useRoute()
const router = useRouter()

const weeks = ref<number[]>([])
const localSelectedWeeks = ref<number[]>([])
watch(() => apiToolkit.maxWeek, () => {
  weeks.value = (new Array(apiToolkit.maxWeek)).fill(1).reduce((r: number[], i) => r.concat([i + (r[r.length - 1] ?? 0)]), [])
}, {immediate: true})


watch(() => store.selectedWeeks, (newSelectedWeeks) => {
  newSelectedWeeks = Array.from(new Set(newSelectedWeeks))
  newSelectedWeeks.sort((a: number, b: number) => a - b)

  // 同步到 weekOptions
  localSelectedWeeks.value = newSelectedWeeks

  // 如果为空，则自动设置为当前周
  if (newSelectedWeeks.length === 0) {
    store.selectedWeeks = [apiToolkit.weekNow]
    store.alertInfo.info = `已自动设置为第${apiToolkit.weekNow}周`
    return
  }

  // route.query
  if (newSelectedWeeks.length !== 0) {
    let weeksInQuery = store.selectedWeeks.length ? newSelectedWeeks.join(",") : undefined
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
    let newSelectedWeeks: number[] = []
    for (let week = 1; week <= apiToolkit.maxWeek; week++) {
      newSelectedWeeks.push(week)
    }
    localSelectedWeeks.value = newSelectedWeeks
  },
  toMakeSelectionsOpposite() {
    let newSelectedWeeks: number[] = []
    for (let week = 1; week <= apiToolkit.maxWeek; week++) {
      if (localSelectedWeeks.value.indexOf(week) === -1) {
        newSelectedWeeks.push(week)
      }
    }
    localSelectedWeeks.value = newSelectedWeeks
  },
  filterOdd() {
    localSelectedWeeks.value = localSelectedWeeks.value.filter(week => week % 2 === 1)
  },
  filterEven() {
    localSelectedWeeks.value = localSelectedWeeks.value.filter(week => week % 2 === 0)
  },
  filterFrontHalf() {
    let weeks = localSelectedWeeks.value
    weeks.sort((a, b) => a - b)
    if (weeks.length >= 2) {
      localSelectedWeeks.value = weeks.filter(week => week <= (weeks[weeks.length - 1] + weeks[0]) / 2)
    }
  },
  refresh() {
    localSelectedWeeks.value = store.selectedWeeks
  },
  submit() {
    localSelectedWeeks.value.sort((a, b) => a - b)
    store.selectedWeeks = localSelectedWeeks.value
  },
}

onMounted(() => localSelectedWeeks.value = store.selectedWeeks)
</script>

<template>
  <div class="WeekSelectBarContainer">
    <div>
      <el-button-group>
        <el-button plain type="default" :icon="Finished" size="small"
                   @click="eventFunc.toSelectAll()">全选
        </el-button>
        <el-button plain type="default" :icon="Switch" size="small"
                   @click="eventFunc.toMakeSelectionsOpposite()">反选
        </el-button>
        <el-button plain type="default" :icon="Coin" size="small"
                   @click="eventFunc.filterOdd()">单周
        </el-button>
        <el-button plain type="default" :icon="Coin" size="small"
                   @click="eventFunc.filterEven()">双周
        </el-button>
        <el-button plain type="default" :icon="Scissor" size="small"
                   @click="eventFunc.filterFrontHalf()">折半
        </el-button>
      </el-button-group>
    </div>

    <div class="WeekSelectBarArea">
      <el-checkbox-group v-model="localSelectedWeeks" size="small">
        <el-checkbox-button
            v-for="week in weeks"
            :key="week"
            :label="week"
        />
        <template>`第${week}周`</template>
      </el-checkbox-group>
    </div>

    <el-button-group>
      <el-button plain type="default" :icon="Select" size="small"
                 @click="eventFunc.submit()">更新
      </el-button>
      <el-button plain type="default" :icon="RefreshLeft" size="small"
                 @click="eventFunc.refresh()">恢复
      </el-button>
    </el-button-group>
  </div>
</template>

<style>
.WeekSelectBarContainer {
  display: flex;
  flex-direction: column;
}

.WeekSelectBarContainer .el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /*width: 350px;*/
}

.WeekSelectBarContainer .el-checkbox-button {
  flex: 0 0 20%;
  width: 100%;
  padding: 3px 0;
}

.WeekSelectBarContainer .el-checkbox-button__inner {
  width: 100%;
  border: 1px #a8abb2 solid;
  border-radius: 4px !important;
}

.WeekSelectBarContainer .el-button-group {
  width: 100%;
  display: flex;
}

.WeekSelectBarContainer .el-button {
  width: 100%;
}
</style>