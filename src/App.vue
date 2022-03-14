<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import {useApiToolkit, useCounterStore} from "./store/counter";
import LoadingMask from "./components/loadingMask.vue";
import TopMenu from "./components/TopMenu.vue";

import {onBeforeMount, onMounted} from "vue";
import {useRoute} from "vue-router";

// import {useRoute, useRouter} from "vue-router";

const store = useCounterStore()
const apiToolkit = useApiToolkit()
const route = useRoute()

// --------------
onBeforeMount(async () => {

})

onMounted(async () => {
  await apiToolkit.requestSemesterConfig()
  const _period = apiToolkit.semesterConfig.first()?.current_period
  apiToolkit.requestDataExceptSemesterConfigAndGroup(_period)

  // region 读取route.query中的group并赋值在store中，如果无效则置undefined
  await apiToolkit.group.requestData({period: _period})
  const groupInQuery = String(route.query.group ?? '').split(',')
  for (const groupString of groupInQuery) {
    let groupId = parseInt(groupString)
    if (!isNaN(groupId)) {
      let groupInApi = (apiToolkit.group.filter(group => group.group_id === groupId))
      if (groupInApi.length > 0) {
        store.groupSelected.push([groupInApi[0].semester, groupId])
      }
    }
  }
  // endregion
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
