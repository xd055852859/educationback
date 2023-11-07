<script setup lang="ts">
import { Search, ArrowDown, Close } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import Avatar from "@/components/avatar.vue";
import Tag from "./tag.vue";
import api from "@/services/api";
import _ from "lodash";
import { ResultProps } from "@/interface/Common";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { token } = storeToRefs(appStore.authStore);
const lessonList = ref<any>([]);
const creatorName = ref<string>("");
const lessonName = ref<string>("");
const lessonType = ref<number>(0);
const statusType = ref<number>(0);
const page = ref<number>(1);
const pageNum = ref<number>(0);
const tagKey = ref<string>("");
const previewVisible = ref<boolean>(false);
const previewUrl = ref<string>("");
// const lessonArray = ["全部", "英语", "语文"];
const statusArray = ["全部", "已发布", "待审核", "已拒绝"];
const creatorList = ref<any>([]);
const searchList = ref<any>([]);
const searchName = ref<string>("");
const creatorType = ref<number>(0);
const creatorState = ref<number>(0);
const creatorArray = ["全部", "通过", "禁用"];
const buttonRef = ref();
const getLesson = async () => {
  const dateRes = (await api.request.get("resource/all", {
    filterType: statusType.value,
    name: lessonName.value,
    developerName: creatorName.value,
    page: page.value,
    tagKey: tagKey.value,
    limit: 30,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    lessonList.value = [...dateRes.data];
    pageNum.value = dateRes.pageNum as number;
  }
};
const updateLesson = async (value, lessonKey, index) => {
  const dateRes = (await api.request.patch("resource/verify", {
    resourceKey: lessonKey,
    operate: value,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    // let lessonIndex = _.findIndex(lessonList.value, { _key: key });
    // if (lessonIndex !== -1) {
    lessonList.value[index].status = value;
    // }
  }
};
const toUrl = (item) => {
  previewVisible.value = true;
  previewUrl.value = `https://yujing.qingtime.cn/#/preview/${item._key}?token=${token.value}&type=back`;
};
watchEffect(() => {
  getLesson();
});
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
        <!-- <el-dropdown style="margin-right: 15px">
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
        </el-dropdown> -->
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
      </div>
    </div>
    <div class="box-table">
      <el-table :data="lessonList" style="height: 100%" fit>
        <el-table-column prop="name" label="课程名称" align="center" />
        <el-table-column label="创作者" align="center">
          <template #default="scope">
            <div class="dp--center">
              <Avatar
                :src="scope.row.developerInfo.logo"
                :alt="scope.row.developerInfo.name"
                :imgStyle="{ marginRight: '8px' }"
              />

              {{ scope.row.developerInfo.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center">
          <template #default="scope">
            <div class="dp--center" style="flex-wrap: wrap">
              <el-tag
                v-for="(item, index) in scope.row.tagInfo"
                :key="`key${item._key}`"
                style="margin-right: 10px"
                >{{ item.name }}</el-tag
              >
            </div></template
          >
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status === 1
                  ? ''
                  : scope.row.status === 2
                  ? 'danger'
                  : 'info'
              "
              >{{
                scope.row.status === 1
                  ? "同意"
                  : scope.row.status === 2
                  ? "禁用"
                  : "待审核"
              }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="toUrl(scope.row)"
              >查看</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="updateLesson(1, scope.row._key, scope.$index)"
              v-if="scope.row.status === 0 || scope.row.status === 2"
              >同意</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="updateLesson(2, scope.row._key, scope.$index)"
              v-if="scope.row.status === 0 || scope.row.status === 1"
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
    <div class="preview-url-box" v-if="previewVisible">
      <div class="preview-url-icon" @click="previewVisible = false">
        <el-icon color="#fff" size="40"><Close /></el-icon>
      </div>
      <div class="preview-url" v-if="previewUrl">
        <IframeView :url="previewUrl" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.preview-url-box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  .preview-url-icon {
    width: 50px;
    height: 50px;
    position: fixed;
    z-index: 15;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }
  .preview-url {
    width: 100%;
    height: 100%;
  }
}
</style>
<style></style>
