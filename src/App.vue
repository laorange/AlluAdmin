<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import {useApiToolkit} from "./store/counter";
import LoadingMask from "./components/loadingMask.vue";
import {onMounted} from "vue";

// const store = useCounterStore()
const apiToolkit = useApiToolkit()

// --------------
import CourseAdminBody from "./components/CourseAdmin/CourseAdmin.vue";


onMounted(() => {
  apiToolkit.requestData()
})
</script>

<template>
  <course-admin-body></course-admin-body>
  <loading-mask></loading-mask>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
