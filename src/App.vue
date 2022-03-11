<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import {useApiToolkit, useCounterStore} from "./store/counter";
import LoadingMask from "./components/loadingMask.vue";
import TopMenu from "./components/TopMenu.vue";

import {onMounted} from "vue";

// import {useRoute, useRouter} from "vue-router";

const store = useCounterStore()
const apiToolkit = useApiToolkit()

// --------------
onMounted(async () => {
  await apiToolkit.requestSemesterConfig()
  const _period = apiToolkit.semesterConfig.first()?.current_period
  store.coursePlanAdmin.period = _period ? _period : undefined
  apiToolkit.requestData(_period)
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
