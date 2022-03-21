<script setup lang="ts">
import {SAME_SITE_AS_DJANGO} from "../../utils/urls";


</script>

<template>
  <h1 v-if="SAME_SITE_AS_DJANGO">🚧 施工中...</h1>
  <template v-else>
    <h1>🙈 预览模式 🙈</h1>
    <h2>其他操作不可见</h2>
  </template>
</template>

<style scoped>

</style>