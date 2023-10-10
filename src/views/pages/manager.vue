<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
const creatorList = ref<any>([]);
const page = ref<number>(1);
const pageNum = ref<number>(0);
</script>
<template>
  <Header title="平台管理" />
  <div class="box">
    <div class="box-header">
      <div></div>
      <div>
        <el-button type="primary">+ 邀请成员</el-button>
      </div>
    </div>
    <div class="box-table">
      <el-table :data="creatorList" style="height: 100%" fit>
        <el-table-column prop="name" label="头像" align="center">
          <template #default="scope"> </template
        ></el-table-column>
        <el-table-column prop="name" label="用户名" align="center" />
        <el-table-column prop="name" label="手机号" align="center" />
        <el-table-column prop="name" label="权限" align="center">
          <template #default="scope"> </template
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope"> </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box-footer">
      <el-pagination
        background
        :page-size="30"
        layout="prev, pager, next"
        :page-count="pageNum"
        @current-change="
          (newPage) => {
            page = newPage;
          }
        "
      />
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
