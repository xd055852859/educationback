<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import api from "@/services/api";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import Avatar from "@/components/avatar.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router";
import { ResultProps } from "@/interface/Common";
const dayjs: any = inject("dayjs");
const { user } = storeToRefs(appStore.authStore);
const memberList = ref<any>([]);
const sonMemberList = ref<any>([]);
const searchName = ref<string>("");
const keyword = ref<string>("");
const addVisible = ref<boolean>(false);
const page = ref<number>(1);
const pageNum = ref<number>(0);
const getData = async () => {
  let dataRes = (await api.request.get("user/list", {
    keyword: keyword.value,
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    memberList.value = dataRes.data;
    pageNum.value = dataRes.data.pageNum as number;
  }
};
const getSonData = async (key) => {
  let dataRes = (await api.request.get("agent/user", {
    creator: key,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    sonMemberList.value = dataRes.data;
  }
};
const deleteMember = (index, userKey, status) => {
  ElMessageBox.confirm(
    `是否${status === 1 ? "解禁" : "禁用"}该用户`,
    `${status === 1 ? "解禁" : "禁用"}用户`,
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
    }
  ).then(async () => {
    const memberRes = (await api.request.patch("user/forbidden", {
      userKey: userKey,
      status: status,
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      ElMessage.success(`${status === 1 ? "解禁" : "禁用"}用户成功`);
      memberList.value[index].status = status;
    }
  });
};

// const addMember = async (index: number, userKey: string) => {
//   const memberRes = (await api.request.post("/developMember", {
//     developerKey: spaceKey.value,
//     role: 3,
//     memberKey: userKey,
//   })) as ResultProps;
//   if (memberRes.msg === "OK") {
//     ElMessage.success("添加成员成功");
//     searchList.value.splice(index, 1);
//     memberList.value.push(memberRes.data);
//     addVisible.value = false;
//   }
// };
// const outMember = () => {
//   ElMessageBox.confirm("是否退出该创作者", "退出创作者", {
//     confirmButtonText: "确认",
//     cancelButtonText: "取消",
//   }).then(async () => {
//     const memberRes = (await api.request.delete("developMember/exit", {
//       developerKey: spaceKey.value,
//     })) as ResultProps;
//     if (memberRes.msg === "OK") {
//       ElMessage.success("退出创作者成功");
//       router.replace("/space");
//     }
//   });
// };
watchEffect(() => {
  getData();
});
</script>
<template>
  <Header title="用户数据" />
  <div class="box">
    <div class="box-header">
      <el-input
        v-model="searchName"
        placeholder="请输入用户名称"
        style="width: 300px"
        :prefix-icon="Search"
        @change="
          keyword = searchName;
          page = 1;
        "
      />
    </div>
    <div class="box-table">
      <el-table :data="memberList" style="height: 100%" fit>
        <el-table-column label="头像" align="center" width="100">
          <template #default="scope">
            <div class="dp-center-center">
              <Avatar :src="scope.row.userAvatar" :alt="scope.row.userName" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="mobile" label="账号" align="center" />
        <el-table-column label="创建角色" align="center" width="150">
          <template #default="scope">
            <el-popover placement="bottom" :width="650" trigger="click">
              <template #reference>
                <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="getSonData(scope.row._key)"
                  >{{ scope.row.agentCount }}</el-button
                >
              </template>
              <el-table :data="sonMemberList">
                <el-table-column label="头像" align="center" width="100">
                  <template #default="scope">
                    <div class="dp-center-center">
                      <Avatar :src="scope.row.icon" :alt="scope.row.name" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="用户名" align="center" />
                <el-table-column label="学习时间" align="center" width="150">
                  <template #default="scope">{{
                    dayjs
                      .duration(scope.row.studyTime * 60000)
                      .asHours()
                      .toFixed(1)
                  }}</template>
                </el-table-column>
                <el-table-column
                  prop="keywordCount"
                  label="关注点"
                  align="center"
                  width="80"
                ></el-table-column>
                <el-table-column
                  prop="noteCount"
                  label="学习大纲"
                  align="center"
                  width="80"
                ></el-table-column>
                <el-table-column
                  prop="subscribeCount"
                  label="订阅课件"
                  align="center"
                  width="80"
                ></el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template #default="scope">{{
            dayjs(scope.row.createTime).format("YYYY-MM-DD")
          }}</template>
        </el-table-column>
        <el-table-column label="最近登录时间" align="center">
          <template #default="scope">{{
            dayjs(scope.row.loginTime).format("YYYY-MM-DD")
          }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              link
              :type="scope.row.status === 2 ? 'danger' : 'primary'"
              size="small"
              @click="
                deleteMember(
                  scope.$index,
                  scope.row._key,
                  scope.row.status === 1 ? 2 : 1
                )
              "
              >{{ scope.row.status === 1 ? "禁用" : "解禁" }}</el-button
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
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
