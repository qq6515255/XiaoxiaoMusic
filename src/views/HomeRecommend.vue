<template>
  <div class="recommend">
    <HomeTitle>推荐歌单</HomeTitle>
    <ul class="list">
      <SongListCard v-for="(item, index) in personalized" :key="index" :item="item" />
    </ul>
    <HomeTitle>最新音乐</HomeTitle>
    <ol>
      <SongListItem
        v-for="(item, index) in newsong"
        :key="index"
        :song-item="item"
        :is-show-quality="true"
        @translate-currentid="$emit('translate-currentid', $event)"
      />
    </ol>
  </div>
</template>

<script>
// 懒加载
const HomeTitle=()=>import("../components/HomeTitle.vue");
const SongListCard=()=>import("../components/SongListCard.vue");
const SongListItem=()=>import("../components/SongListItem.vue");

export default {
  name: "HomeRecommend",
  components: {
    HomeTitle,
    SongListCard,
    SongListItem
  },
  data: function() {
    return {
      personalized: [],
      newsong: []
    };
  },
  methods: {
    getPersonalized() {
      this.axios
        .get("http://junnaix.cn:7878/personalized?limit=6")
        .then(response => {
          ({ result: this.personalized } = response.data);
          // window.console.log(response)
        });
    },
    getNewsong() {
      this.axios
        .get("http://junnaix.cn:7878/personalized/newsong")
        .then(response => {
          ({ result: this.newsong } = response.data);
          // window.console.log(response)
        });
    }
  },
  created() {
    // 组件创建完成 拿数据
    this.getPersonalized();
    this.getNewsong();
  }
};
</script>

<style lang="less" scoped >
.recommend{
  padding-top: 15px;
}
li.song{
  padding-left: 10px;
}
ul.list {

  display: flex;
  flex-wrap: wrap;
  li.card {
    flex: 1 0 30%;
    &:nth-child(3n + 2) {
      margin: 0 5px;
    }
  }
}
</style>