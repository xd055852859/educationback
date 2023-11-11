<script setup lang="ts">
import { Search, ArrowDown } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import api from "@/services/api";
import { ResultProps, ROLE_OPTIONS } from "@/interface/Common";
const dayjs: any = inject("dayjs");
const suggestionList = ref<any>([]);

onMounted(() => {
  getData();
});
const getData = async () => {
  let dataRes = (await api.request.get("suggestion")) as ResultProps;
  if (dataRes.msg === "OK") {
    suggestionList.value = dataRes.data;
  }
};
</script>
<template>
  <Header title="评价管理" />
  <div class="box">
    <div class="box-header">
      <!-- <el-input
        v-model="searchName"
        placeholder="请输入用户名称"
        style="width: 300px"
        :prefix-icon="Search"
      /> -->
      <div></div>
      <div></div>
    </div>
    <div class="box-table">
      <el-table :data="suggestionList" style="height: 100%" stripe>
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="score" label="评分" align="center" />
        <el-table-column label="日期" align="center">
          <template #default="scope">{{
            dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm")
          }}</template>
        </el-table-column>
        <el-table-column prop="content" label="建议" align="center" />
      </el-table>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
