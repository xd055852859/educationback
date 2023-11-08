<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import { Plus, Close } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import api from "@/services/api";
import _ from "lodash";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatData } from "@/services/util";

const tagList = ref<any>(null);
const tagInput = ref<string>("");
const tagKey = ref<string>("");
const tagIndex = ref<number>(-1);
const nodeId = ref<string>("");
const nodeText = ref<string>("");
const textState = ref<boolean>(false);

onMounted(() => {
  getTag();
});
const getTag = async () => {
  const dataRes = (await api.request.get("tag/tree")) as ResultProps;
  if (dataRes.msg === "OK") {
    tagList.value = [formatData(dataRes.data, dataRes.rooter._key)];
    console.log(tagList.value);
  }
};
const addTag = async (selectedId: any, data) => {
  let addTaskRes: any = await api.request.post("tag", {
    fatherId: selectedId,
    name: "新标签",
  });
  if (addTaskRes.msg === "OK") {
    ElMessage.success("创建新标签成功");
    if (!data.children) {
      data.children = [];
    }
    data.children.push(addTaskRes.data);
    tagList.value = [...tagList.value];
    // loadNode(treeRef.value.getNode(data._key))
    // treeRef.value.updateKeyChildren(data._key, newData);
  }
};
const updateTag = async (key: string, value, callback, nodeKey?: string) => {
  let updateRes: any = await api.request.patch("tag", {
    tagKey: nodeId.value,
    [key]: value,
  });
  if (updateRes.msg === "OK") {
    callback();
  }
};
const editNodeText = (data) => {
  updateTag("name", nodeText.value, () => {
    data.name = nodeText.value;
    nodeId.value = "";
  });
};
const chooseTag = (item, index) => {
  tagKey.value = item._key;
  tagIndex.value = index;
  tagInput.value = item.name;
};
const deleteTag = async (node, data, index) => {
  ElMessageBox.confirm("是否删除该标签", "删除标签", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const delRes = (await api.request.delete("tag", {
      tagKey: data._key,
    })) as ResultProps;
    if (delRes.msg === "OK") {
      ElMessage.success("删除标签成功");
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d._key === data._key);
      children.splice(index, 1);
      tagList.value = [...tagList.value];
    }
  });
};

const chooseTagText = (data) => {
  let newDate = _.cloneDeep(data);
  nodeId.value = newDate._key;
  nodeText.value = newDate.name;
  textState.value = true;
};
</script>
<template>
  <Header title="标签管理" />
  <div class="tag box" v-if="tagList">
    <!--  :draggable="true"
      :allow-drop="allowNode" @node-click="chooseNode"
    @node-contextmenu="showDropdown" @node-drop="dragNode"
    @node-drag-enter="enterNode" @node-drag-leave="leaveNode" -->
    <div class="menu-tree">
      <el-tree
        :data="tagList"
        :accordion="true"
        :indent="45"
        node-key="_key"
        :default-expand-all="true"
        :expand-on-click-node="false"
        ref="treeRef"
      >
        <template #default="{ node, data }">
          <!-- :style="chooseKey === data._key ? { background: '#ebebeb' } : {}" -->
          <!--  @mouseenter="setOver(data._key, type)" -->
          <div
            class="menu-tree-item"
            @dblclick="
              node.level !== 1 && node.level !== 2 ? chooseTagText(data) : null
            "
          >
            <div class="tree-item-left dp--center">
              <div v-if="textState && nodeId === data._key">
                <el-input
                  v-model="nodeText"
                  placeholder="请输入节点名"
                  autofocus
                  @change="editNodeText(data)"
                  @blur="
                    nodeId = '';
                    textState = false;
                  "
                  size="small"
                />
              </div>
              <div
                class="single-to-long"
                style="max-width: calc(100% - 30px)"
                v-else
              >
                {{ data.name }}
              </div>
              <div class="tree-item-button" v-if="node.level !== 1">
                <el-button
                  :icon="Plus"
                  circle
                  @click="addTag(data._key, data)"
                  style="margin-left: 25px"
                  size="small"
                />
                <el-button
                  :icon="Close"
                  circle
                  @click="deleteTag(node, data, data)"
                  size="small"
                  v-if="node.level !== 1 && node.level !== 2"
                />
              </div>
            </div>
            <div class="tree-item-right"></div>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tag {
  @include p-number(10px, 25px);
  @include scroll();
  .menu-tree {
    min-width: 150px;
    .menu-tree-item {
      width: calc(100% - 25px);
      height: 100%;
      @include flex(space-between, center, null);
      .tree-item-left {
        width: calc(100% - 35px);
        @include flex(flex-start, center, null);
      }
      .tree-item-button {
        display: none;
      }

      &:hover {
        .tree-item-button {
          @include flex(flex-end, center, null);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.tag {
  .el-tree-node__content {
    height: 40px;
  }
}
</style>
