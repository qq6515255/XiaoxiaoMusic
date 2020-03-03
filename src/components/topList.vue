<template>
  <div class="main">
    <div class='img-box' @click="handlerTopList(top.id)">
      <img :src="top.coverImgUrl" alt="榜单图片" />
    </div>
    <ul class="info">
      <li v-for="(item, index) in top.top" :key="index" @click="setCurrentSongId(item.id)">
        <h3>{{ index + 1 }}. {{ item.al.name }} - {{ item.ar[0].name }}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["top"],
  methods: {
    // 图片点击事件
    handlerTopList(id){
      this.$router.push({ path: "playlist", query: { id } });

    },
    setCurrentSongId(id) {
      
      this.$emit("translate-currentid", {id});
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  overflow: hidden;
  padding: 5px 0px;
  margin: 0px 10px;
  border-bottom: 1px solid #e4e4e4;
  .img-box{
    overflow: hidden;
    float: left;
  }
  img {
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 5px;
  }
  .info {
    height: 100px;
    padding: 5px 0px 5px 15px;
    overflow: hidden;
    li {
      height: 30px;
      overflow: hidden;

      h3 {
        width: 100%;
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
        line-height: 30px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>
