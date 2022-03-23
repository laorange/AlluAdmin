<script setup lang="ts">
import {useCounterStore} from "../store/counter";
import {watch} from "vue";

const store = useCounterStore()

const initAlertInfo = {
  success: "",
  info: "",
  warning: "",
  error: "",
}

let timer: number | null = null
watch(() => store.alertInfo, (newAlertInfo) => {
  if (!(store.alertInfo.success + store.alertInfo.info + store.alertInfo.warning + store.alertInfo.error)) {
    return
  }
  timer = setTimeout(() => {
    store.alertInfo = {...initAlertInfo}
  }, 2000);
}, {deep: true})
</script>

<template>
  <el-alert :title="store.alertInfo.success" type="success" v-show="store.alertInfo.success"/>
  <el-alert :title="store.alertInfo.info" type="info" v-show="store.alertInfo.info"/>
  <el-alert :title="store.alertInfo.warning" type="warning" v-show="store.alertInfo.warning"/>
  <el-alert :title="store.alertInfo.error" type="error" v-show="store.alertInfo.error"/>
</template>

<style scoped>
.el-alert {
  margin: 20px 0 0;
  position: absolute;
  top: 5vh;
  display: flex;
  width: 100%;
  justify-content: center;
  z-index: 999;
}

.el-alert:first-child {
  margin: 0;
}

</style>
