<script setup lang="ts">
import Header from "@/components/header.vue";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
const resourceList = ref<any>([]);
const totalLesson = ref<number>(0);
const userNum = ref<number>(0);
onMounted(() => {
  getData();
});
const getData = async () => {
  const dataRes = (await api.request.get("resource/summary")) as ResultProps;
  if (dataRes.msg === "OK") {
    totalLesson.value = dataRes.data.totalLesson;
    userNum.value = dataRes.data.userNum;
    resourceList.value = dataRes.data.resourceList;
  }
};
</script>
<template>
  <Header title="概览" />
  <div class="overview box">
    <div class="overview-header">
      <el-row :gutter="25">
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="header-title">课程数量</div>
            <div class="header-content">{{ totalLesson }}</div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="hover">
            <div class="header-title">订阅次数</div>
            <div class="header-content">{{ userNum }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="overview-content">
      <el-row :gutter="25">
        <el-col :span="24">
          <el-card shadow="hover">
            <el-table
              :data="resourceList"
              fit
              style="height: calc(100vh - 300px)"
              stripe
            >
              <el-table-column
                label="序号"
                type="index"
                width="100"
                align="center"
              />
              <el-table-column prop="name" label="课程榜单" align="center" />
              <el-table-column prop="agentNum" label="订阅数" align="center" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped lang="scss">
.overview {
  @include p-number(10px, 25px);
  .overview-header {
    width: 100%;
    height: 170px;
    margin-bottom: 20px;
    .header-title {
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
    .header-content {
      width: 100%;
      height: 110px;
      text-align: center;
      line-height: 110px;
      font-size: 35px;
      font-weight: 600;
    }
  }
  .overview-content {
    height: calc(100% - 200px);
  }
}
</style>
<style></style>
