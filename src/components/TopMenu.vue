<script setup lang="ts">

import {useRoute} from "vue-router";

const route = useRoute()

</script>

<template>
  <el-menu
      :default-active="route.name"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#666666"
      text-color="white"
      :router="true"
  >
    <img src="../assets/siae.png" alt="siae.png" style="height: 59px; margin-right: 5px"/>
    <el-menu-item index="CoursePlanAdmin">教学计划</el-menu-item>
    <el-menu-item index="CourseAdmin">课表编辑</el-menu-item>
    <el-menu-item index="OtherAdmin">其他操作</el-menu-item>
  </el-menu>
</template>

<style scoped>

</style>