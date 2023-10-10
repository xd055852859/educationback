<script setup lang="ts">
import Header from "@/components/header.vue";
const logList=ref<any>([])
</script>
<template>
  <Header title="管理日志" />
  <div class="box">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in logList"
        :key="index"
        :timestamp="item.updateTime"
      >
        {{ item.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
