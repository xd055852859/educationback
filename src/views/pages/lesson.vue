<script setup lang="ts">
import { Search, ArrowDown } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import Tag from "./tag.vue";
const lessonList = ref<any>([]);
const creatorName = ref<string>("");
const lessonName = ref<string>("");
const lessonType = ref<number>(0);
const statusType = ref<number>(0);
const page = ref<number>(1);
const pageNum = ref<number>(0);
const tagVisible = ref<boolean>(false);

const lessonArray = ["全部", "英语", "语文"];
const statusArray = ["全部", "已发布", "待审核", "已拒绝"];
</script>
<template>
  <Header title="课件管理" />
  <div class="box">
    <div class="box-header">
      <div>
        <el-input
          v-model="creatorName"
          placeholder="请输入创作者名称"
          style="width: 200px; margin-right: 15px"
          :prefix-icon="Search"
        />
        <el-input
          v-model="lessonName"
          placeholder="请输入课程名称"
          style="width: 200px"
          :prefix-icon="Search"
        />
      </div>
      <div>
        <el-dropdown style="margin-right: 15px">
          <div class="icon-point dp--center">
            {{ lessonArray[lessonType] }}
            <el-icon style="margin-left: 8px"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in lessonArray"
                @click="lessonType = index"
                :key="`lesson${index}`"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown>
          <div class="icon-point dp--center">
            {{ statusArray[statusType] }}
            <el-icon style="margin-left: 8px; margin-right: 8px"
              ><ArrowDown
            /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in statusArray"
                @click="statusType = index"
                :key="`status${index}`"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="primary" @click="tagVisible = true"
          >标签管理</el-button
        >
      </div>
    </div>
    <div class="box-table">
      <el-table :data="lessonList" style="height: 100%" fit>
        <el-table-column prop="name" label="学科" align="center" />
        <el-table-column prop="name" label="课程名称" align="center" />
        <el-table-column prop="name" label="创作者" align="center" />
        <el-table-column prop="name" label="发布时间" align="center" />
        <el-table-column prop="name" label="学习次数" align="center" />
        <el-table-column prop="name" label="状态" align="center" />
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click=""
              >查看</el-button
            >
            <el-button link type="primary" size="small" @click=""
              >禁用</el-button
            >
          </template>
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
    <el-dialog v-model="tagVisible" title="标签管理" width="400px" align-center>
      <Tag />
    </el-dialog>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
