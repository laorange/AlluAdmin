<script setup lang="ts">
import urls from "../utils/urls";

import {useRoute, useRouter} from "vue-router";

import PageTopAlerts from "./PageTopAlerts.vue";


const route = useRoute()
const router = useRouter()

const selectHandler = (key: string, keyPath?: string[]) => {
  if (key === 'docs') {
    location.href = urls.docs
  } else {
    router.push({
      name: key,
      query: {
        ...route.query
      }
    })
  }
}

</script>

<template>
  <el-menu
      :default-active="route.name"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#707070"
      active-text-color="#64f2ff"
      text-color="white"
      @select="selectHandler"
  >
    <img src="../assets/siae.png" alt="siae.png" style="height: 59px; margin-right: 5px"/>
    <el-menu-item index="CoursePlanAdmin">教学计划</el-menu-item>
    <el-menu-item index="CourseAdmin">课表编辑</el-menu-item>
    <el-menu-item index="OtherAdmin">其他操作</el-menu-item>
    <el-menu-item index="docs">帮助文档</el-menu-item>
  </el-menu>

  <page-top-alerts></page-top-alerts>
</template>

<style scoped>

</style>