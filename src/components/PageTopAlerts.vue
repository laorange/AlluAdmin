<script setup lang="ts">
import {useCounterStore} from "../store/counter";
import {ref, watch} from "vue";

const store = useCounterStore()

const initAlertInfo = {
  success: "",
  info: "",
  warning: "",
  error: "",
}

const alertInfo = ref(initAlertInfo)

watch(() => store.alertInfo, (newAlertInfo) => {
  console.log("有更改：", newAlertInfo)
  alertInfo.value = newAlertInfo
  setTimeout(() => alertInfo.value = initAlertInfo, 3000)
}, {deep: true, immediate: true})
</script>

<template>
  <el-alert :title="alertInfo.success" type="success" v-if="alertInfo.success"/>
  <el-alert :title="alertInfo.info" type="info" v-if="alertInfo.info"/>
  <el-alert :title="alertInfo.warning" type="warning" v-if="alertInfo.warning"/>
  <el-alert :title="alertInfo.error" type="error" v-if="alertInfo.error"/>
</template>

<style scoped>
.el-alert {
  margin: 20px 0 0;
}

.el-alert:first-child {
  margin: 0;
}
</style>
