<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
<template>
  <div className="header">
    <div className="header-title">
      {{ title }}
    </div>

    <div className="header-button"><slot name="button"></slot></div>
  </div>
</template>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 55px;
  padding: 0px 15px 0px 25px;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  @include flex(space-between, center, null);
  .header-title {
    font-size: 20px;
    font-weight: 600;
    color: #000000;
    @include flex(flex-start, center, null);
    .header-back {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .header-button {
    height: 100%;
    cursor: pointer;
    @include flex(flex-end, center, null);
    .button-img {
      width: 40px;
      height: 100%;
      font-size: 25px;
      @include flex(center, center, null);
    }
  }
}
</style>
<style></style>
