<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import {useApiToolkit, useCounterStore} from "./store/counter";
import LoadingMask from "./components/loadingMask.vue";
import TopMenu from "./components/TopMenu.vue";

import {onMounted} from "vue";
import {useRoute} from "vue-router";

const store = useCounterStore()
const apiToolkit = useApiToolkit()
const route = useRoute()

// region 读取route.query中的有效信息并赋值在store中
function useRouterQueryReader() {
  // region groups
  const groupsInQuery = String(route.query.groups ?? '').split(',')
  for (const groupString of groupsInQuery) {
    let groupId = parseInt(groupString)
    if (!isNaN(groupId)) {
      let groupInApi = (apiToolkit.group.filter(group => group.group_id === groupId))
      if (groupInApi.length > 0) {
        store.groupSelected.push([groupInApi[0].semester, groupId])
      }
    }
  }
  // endregion

  // region weeks
  const weeksInQuery = String(route.query.weeks ?? '').split(',')
  for (const weekString of weeksInQuery) {
    let week = parseInt(weekString)
    if (!isNaN(week)) {
      store.courseAdmin.weekSelected.push(week)
    }
  }
  // endregion
}

// endregion


onMounted(async () => {
  await apiToolkit.requestSemesterConfig()
  apiToolkit.requestDataExceptSemesterConfigAndGroup(apiToolkit.period)
  await apiToolkit.group.requestData({period: apiToolkit.period})
  useRouterQueryReader()
})
</script>

<template>
  <top-menu></top-menu>
  <router-view></router-view>
  <loading-mask></loading-mask>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
