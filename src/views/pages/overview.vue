<script setup lang="ts">
import Header from "@/components/header.vue";
const enList = ref<any>([]);
const cnList = ref<any>([]);
</script>
<template>
  <Header title="概览" />
  <div class="overview box">
    <div class="overview-header">
      <el-row :gutter="25">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="header-title">课程数量(语文)</div>

            <div class="header-content">9999</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="header-title">课程数量(英语)</div>
            <div class="header-content">333</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="header-title">课程数量(语文)</div>

            <div class="header-content">9999</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="header-title">课程数量(英语)</div>
            <div class="header-content">333</div></el-card
          >
        </el-col>
      </el-row>
    </div>
    <div class="overview-content">
      <el-row :gutter="25">
        <el-col :span="12">
          <el-card shadow="hover">
            <el-table :data="enList" fit style="height: calc(100vh - 300px)">
              <el-table-column type="index" width="50" />
              <el-table-column
                prop="name"
                label="课程榜单(语文)"
                align="center"
              />
              <el-table-column
                prop="name"
                label="累计学习次数"
                align="center"
              />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <el-table :data="cnList" fit style="height: calc(100vh - 300px)">
              <el-table-column type="index" width="50" />
              <el-table-column
                prop="name"
                label="课程榜单(英语)"
                align="center"
              />
              <el-table-column
                prop="name"
                label="累计学习次数"
                align="center"
              />
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
