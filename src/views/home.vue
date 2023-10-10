<script setup lang="ts">
import { ElMessage } from "element-plus";
import {
  DataLine,
  Notebook,
  SwitchButton,
  Picture,
  SetUp,
} from "@element-plus/icons-vue";
import router from "@/router";
const logout = () => {
  router.push("/");
  localStorage.clear();
  ElMessage({
    message: "退出登录成功",
    type: "success",
    duration: 1000,
  });
};
</script>
<template>
  <div class="home">
    <div class="home-left">
      <div class="home-title">
        <!-- <img :src="logoSvg" alt="" class="home-logo" /> -->
        <div style="text-align: center">
          飞梭运营后台
        </div>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="home-menu"
        :default-active="$route.fullPath"
        text-color="#fff"
        router
      >
        <el-menu-item index="/home/overview">
          <el-icon :size="35"><data-line /></el-icon>
          <div class="menu-title">概览</div>
        </el-menu-item>
        <el-menu-item index="/home/user">
          <el-icon :size="35"><SetUp /></el-icon>
          <div class="menu-title">用户</div>
        </el-menu-item>
        <el-menu-item index="/home/lesson">
          <el-icon :size="35"><Picture /></el-icon>
          <div class="menu-title">课件</div>
        </el-menu-item>
        <el-menu-item index="/home/creator">
          <el-icon :size="35"><Notebook /></el-icon>
          <div class="menu-title">创作者</div>
        </el-menu-item>
        <el-menu-item index="/home/manager">
          <el-icon :size="35"><Notebook /></el-icon>
          <div class="menu-title">管理者</div>
        </el-menu-item>
        <el-menu-item index="/home/log">
          <el-icon :size="35"><Notebook /></el-icon>
          <div class="menu-title">管理日记</div>
        </el-menu-item>
      </el-menu>
      <div @click="logout" class="logout-button">
        <el-icon :size="35" :color="'#fff'"><switch-button /></el-icon>
      </div>
    </div>
    <div class="home-right">
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  @include flex(space-between, null, null);

  .home-left {
    width: 200px;
    height: 100vh;
    background-color: #545c64;
    align-content: flex-start;
    position: relative;
    z-index: 1;
    @include flex(center, null, wrap);
    .home-title {
      width: 100%;
      height: 60px;
      color: #fff;
      font-size: 16px;
      @include flex(center, center, wrap);
      .home-logo {
        width: 100px;
        height: 100px;
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
    .home-menu {
      width: 100%;
      height: calc(100% - 60px);
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
      .menu-title {
        width: calc(100% - 40px);
        margin-left: 8px;
        font-size: 16px;
      }
    }
    .logout-button {
      width: 100%;
      height: 80px;
      cursor: pointer;
      position: absolute;
      left: 0px;
      bottom: 0px;
      z-index: 2;
      @include flex(center, center, null);
    }
  }
  .home-right {
    width: calc(100vw - 200px);
    height: 100vh;
  }
}
</style>
<style></style>
