<template>
  <h3 class="title">
    <slot></slot>
  </h3>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>

.title {
  line-height: 20px;
  padding:0px 10px;
  margin-bottom: 15px;
  border-left: 2px solid red;
}
</style>