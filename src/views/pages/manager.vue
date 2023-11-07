<script setup lang="ts">
import { Search, ArrowDown } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import api from "@/services/api";
import Avatar from "@/components/avatar.vue";
import { ResultProps, ROLE_OPTIONS } from "@/interface/Common";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { user, role } = storeToRefs(appStore.authStore);
const creatorList = ref<any>([]);
const searchList = ref<any>([]);
const addVisible = ref<boolean>(false);
const page = ref<number>(1);
const pageNum = ref<number>(0);
const memberInput = ref<string>("");
const memberRole = ref<number>(10);
onMounted(() => {
  getData();
});
const getData = async () => {
  let dataRes = (await api.request.get("admin", {})) as ResultProps;
  if (dataRes.msg === "OK") {
    creatorList.value = dataRes.data;
  }
};
const changeRole = async (val, index) => {
  const roleRes = (await api.request.patch("admin/role", {
    memberKey: creatorList.value[index].userKey,
    newRole: val,
  })) as ResultProps;
  if (roleRes.msg === "OK") {
    creatorList.value[index].adminRole = val;
  }
};
const deleteMember = (index) => {
  ElMessageBox.confirm("是否删除该管理者", "删除管理者", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const memberRes = (await api.request.delete("admin", {
      memberKeyArr: [creatorList.value[index].userKey],
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      ElMessage.success("删除用户成功");
      creatorList.value.splice(index, 1);
    }
  });
};
const searchMember = async () => {
  if (memberInput.value) {
    const searchRes = (await api.request.get("user/search", {
      keyWord: memberInput.value,
    })) as ResultProps;
    if (searchRes.msg === "OK") {
      searchList.value = searchRes.data;
    }
  } else {
    searchList.value = [];
  }
};
const addMember = async (index: number, userKey: string) => {
  const memberRes = (await api.request.post("/admin", {
    role: 3,
    memberKey: userKey,
  })) as ResultProps;
  if (memberRes.msg === "OK") {
    ElMessage.success("添加成员成功");
    searchList.value.splice(index, 1);
    creatorList.value.push(memberRes.data);
    addVisible.value = false;
  }
};
</script>
<template>
  <Header title="平台管理" />
  <div class="box">
    <div class="box-header">
      <div></div>
      <div>
        <el-button type="primary" @click="addVisible = true"
          >+ 邀请成员</el-button
        >
      </div>
    </div>
    <div class="box-table">
      <el-table :data="creatorList" style="height: 100%" fit>
        <el-table-column prop="name" label="头像" align="center">
          <template #default="scope">
            <div class="dp-center-center">
              <Avatar
                :src="scope.row.userAvatar"
                :alt="scope.row.userName"
                :size="40"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="mobile" label="手机号" align="center" />
        <el-table-column label="权限" align="center">
          <template #default="scope">
            <div
              class="icon-point dp-center-center"
              v-if="role < scope.row.adminRole"
            >
              <el-dropdown>
                <div
                  class="dp-center-center"
                  style="
                     {
                      height: 100%;
                    }
                  "
                >
                  {{
                    scope.row.adminRole === 0
                      ? "超管"
                      : ROLE_OPTIONS[scope.row.adminRole - 1]?.label
                  }}
                  <el-icon style="margin-left: 10px"><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, index) in ROLE_OPTIONS"
                      :key="item.value"
                      @click="changeRole(item.value, scope.$index)"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div v-else class="dp-center-center">
              {{
                scope.row.adminRole === 0
                  ? "超管"
                  : ROLE_OPTIONS[scope.row.adminRole - 1]?.label
              }}
            </div>
          </template></el-table-column
        >
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteMember(scope.$index)"
              v-if="scope.row.adminRole > role"
              >删除</el-button
            ></template
          >
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
    <el-dialog
      v-model="addVisible"
      title="搜索用户"
      width="40%"
      @close="
        addVisible = false;
        memberInput = '';
        searchList = [];
      "
      destroy-on-close
    >
      <div class="member-search">
        <div class="member-search-title dp-space-center">
          <el-input
            v-model="memberInput"
            placeholder="请输入用户名"
            :prefix-icon="Search"
            @change="searchMember()"
            size="large"
          />
        </div>
        <div class="member-search-container">
          <template v-if="searchList.length > 0">
            <div
              class="member-search-item"
              v-for="(item, index) in searchList"
              :key="`search${index}`"
            >
              <div class="member-search-left">
                <div class="member-search-avatar">
                  <Avatar :src="item.userAvatar" :alt="item.userName" />
                </div>
                <div>{{ item.userName }}</div>
              </div>
              <div class="member-search-right">
                <el-button type="primary" @click="addMember(index, item._key)">
                  邀请
                </el-button>
              </div>
            </div>
          </template>
          <div class="dp-center-center" :style="{ height: '100%' }" v-else>
            <el-empty description="未搜索到用户" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.member-search {
  width: 100%;
  @include p-number(10px, 25px);
  .member-search-title {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
  }
  .member-search-container {
    width: 100%;
    height: 50vh;
    @include scroll();
    .member-search-item {
      width: 100%;
      height: 70px;
      @include flex(space-between, center, null);
      .member-search-left {
        @include flex(space-between, center, null);
        .member-search-avatar {
          width: 50px;
          height: 50px;
          margin-right: 10px;
          @include flex(center, center, null);
        }
      }
      .member-search-right {
        height: 100%;
        @include flex(center, center, null);
      }
    }
  }
}
</style>
<style></style>
