<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ArrowDown } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import Avatar from "@/components/avatar.vue";
import api from "@/services/api";
import { useDebounceFn } from "@vueuse/core";
import _ from "lodash";
import { ResultProps } from "@/interface/Common";
import { ElMessage, ElMessageBox } from "element-plus";
const creatorList = ref<any>([]);
const searchList = ref<any>([]);
const searchName = ref<string>("");
const creatorType = ref<number>(0);
const creatorState = ref<number>(0);
const chooseIndex = ref<number>(-1);
const chooseKey = ref<string>("");
const creatorArray = ["全部", "通过", "禁用"];
const buttonRef = ref();
onMounted(() => {
  getCreator();
});
const getCreator = async () => {
  const dateRes = (await api.request.get("developer/list", {
    filterType: creatorType.value,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    creatorList.value = [...dateRes.data];
    searchCreator("");
  }
};
const searchCreator = useDebounceFn((value: string) => {
  if (value) {
    searchList.value = _.cloneDeep(creatorList.value).filter((item) => {
      return item.name.includes(value);
    });
  } else {
    searchList.value = _.cloneDeep(creatorList.value);
  }
}, 500);
const updateCreator = async (value, key, index) => {
  const dateRes = (await api.request.patch("developer/verify", {
    developerKey: key,
    operate: value,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    searchList.value[index].status = value;
    let creatorIndex = _.findIndex(creatorList.value, { _key: key });
    if (creatorIndex !== -1) {
      creatorList.value[creatorIndex].status = value;
    }
  }
};
const deleteCreator = (key, index) => {
  ElMessageBox.confirm("是否删除该创作者", "删除创作者", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const memberRes = (await api.request.delete("developer", {
      developerKey: key,
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      ElMessage.success("删除创作者成功");
      searchList.value.splice(index, 1);
      let creatorIndex = _.findIndex(creatorList.value, { _key: key });
      if (creatorIndex !== -1) {
        creatorList.value.splice(creatorIndex, 1);
      }
    }
  });
};
watchEffect(() => {
  getCreator();
});
</script>
<template>
  <Header title="创作者管理" />
  <div class="box">
    <div class="box-header">
      <div>
        <el-input
          v-model="searchName"
          placeholder="请输入创作者"
          style="width: 200px"
          :prefix-icon="Search"
          @input="searchCreator"
        />
      </div>
      <div>
        <el-dropdown>
          <div class="icon-point dp--center">
            {{ creatorArray[creatorType] }}
            <el-icon style="margin-left: 8px"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in creatorArray"
                @click="creatorType = index"
                :key="`creator${index}`"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="box-table" style="height: calc(100% - 55px)">
      <el-table :data="searchList" style="height: 100%" fit>
        <el-table-column label="头像" align="center">
          <template #default="scope"
            ><div class="dp-center-center">
              <Avatar :src="scope.row.logo" :alt="scope.row.name" :size="40" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="创作者" align="center" />
        <el-table-column prop="contact" label="手机号" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? '' : 'danger'">{{
              scope.row.status === 1 ? "通过" : "禁用"
            }}</el-tag></template
          ></el-table-column
        >
        <el-table-column prop="resourceNum" label="发布课件" align="center" />
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-popover trigger="click" title="创建者审核">
              <template #reference>
                <el-button
                  type="primary"
                  link
                  ref="buttonRef"
                  @click="creatorState = scope.row.status"
                  >{{ scope.row.status === 1 ? "禁用" : "通过" }}</el-button
                >
              </template>
              <el-radio-group
                v-model="creatorState"
                @change="
                  (value) => {
                    updateCreator(value, scope.row._key, scope.$index);
                  }
                "
              >
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">禁用</el-radio>
              </el-radio-group>
            </el-popover>

            <el-button
              type="primary"
              size="small"
              link
              @click="deleteCreator(scope.row._key, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
