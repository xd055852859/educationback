<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { ElMessage, ElMessageBox } from "element-plus";
const tagList = ref<any>([]);
const tagInput = ref<string>("");
const tagKey = ref<string>("");
const tagIndex = ref<number>(-1);
onMounted(() => {
  getTag();
});
const getTag = async () => {
  const dataRes = (await api.request.get("tag/tree")) as ResultProps;
  if (dataRes.msg === "OK") {
    tagList.value = Object.values(dataRes.data).filter((item: any) => {
      return item._key !== dataRes.rooter._key;
    });
  }
};
const updateTag = async () => {
  if (tagKey.value) {
    const updateRes = (await api.request.patch("tag", {
      tagKey: tagKey.value,
      name: tagInput.value,
    })) as ResultProps;
    if (updateRes.msg === "OK") {
      tagList.value[tagIndex.value].name = tagInput.value;
      tagInput.value = "";
      tagKey.value = "";
      tagIndex.value = -1;
    }
  } else {
    const updateRes = (await api.request.post("tag", {
      tagKey: tagKey.value,
      name: tagInput.value,
    })) as ResultProps;
    if (updateRes.msg === "OK") {
      tagList.value.push(updateRes.data);
      tagInput.value = "";
    }
  }
};
const chooseTag = (item, index) => {
  tagKey.value = item._key;
  tagIndex.value = index;
  tagInput.value = item.name;
};
const deleteTag = async (key, index) => {
  ElMessageBox.confirm("是否删除该标签", "删除标签", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const delRes = (await api.request.delete("tag", {
      tagKey: key,
    })) as ResultProps;
    if (delRes.msg === "OK") {
      ElMessage.success("删除标签成功");
      tagList.value.splice(index, 1);
    }
  });
};
</script>
<template>
  <div class="tag">
    <el-input
      v-model="tagInput"
      :placeholder="`请输入${tagKey ? '编辑' : '新增'}标签名`"
      @change="updateTag"
    />
    <div class="tag-container dp--center">
      <el-tag
        v-for="(item, index) in tagList"
        :key="`tag${item._key}`"
        closable
        :disable-transitions="false"
        @close="deleteTag(item._key, index)"
        @click="chooseTag(item, index)"
        style="margin-right: 10px"
      >
        {{ item.name }}
      </el-tag>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tag {
  padding: 10px 25px 35px 25px;
  box-sizing: border-box;
  .tag-container {
    width: 100%;
    min-height: 60px;
    margin-bottom: 10px;
  }
}
</style>
<style></style>
