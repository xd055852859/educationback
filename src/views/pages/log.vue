<script setup lang="ts">
import Header from "@/components/header.vue";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
const dayjs: any = inject("dayjs");
const logList = ref<any>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const getData = async () => {
  let dataRes = (await api.request.get("admin/log", {
    page: page.value,
    limit: 50,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    logList.value.push(...dataRes.data);
    total.value = dataRes.total as number;
    console.log(logList.value);
  }
};
const scrollLog = (e) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    logList.value.length < total.value
  ) {
    page.value++;
  }
};
watchEffect(() => {
  getData();
});
</script>
<template>
  <Header title="管理日志" />
  <div class="log-box box" @scroll="scrollLog" v-if="logList.length > 0">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in logList"
        :key="`log${item._key}`"
        :timestamp="dayjs(item.createTime).format('YYYY-MM-DD HH:mm')"
      >
        {{ item.log }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<style scoped lang="scss">
.log-box {
  @include scroll();
}
</style>
<style></style>
