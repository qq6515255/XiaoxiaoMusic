<template>
  <scroll
    @scroll="scroll"
    :probe-type="probeType"
    :listen-scroll="listenScroll"
    ref="list"
    class="palylist list"
  >
    <div class="go-back" @click="$router.go(-1)">
      <span class="fa fa-angle-left " aria-hidden="true"></span>
    </div>
    <div v-if="playlist" class="img-box" :style="'background-image:url(' + bgimg + ')'">
      <div class="filter"></div>
      <div class="listInfo">
        <h2 class="title">{{ playlist.name }}</h2>
        <span class="fa fa-headphones"></span>
        <span class="playCount">{{ translatePlayCount(playlist.playCount) }}</span>
        <p class="description">{{ playlist.description }}</p>
      </div>
    </div>
    <ul class="songlist">
      <template v-if="playlist">
        <SongListItem
          v-for="(item, index) in playlist.tracks.slice(0, listLength)"
          :key="index"
          :song-item="item"
          :is-show-quality="false"
          :index="index"
          @translate-currentid="$emit('translate-currentid', $event)"
        />
      </template>
    </ul>
  </scroll>
</template>

<script>
const SongListItem = () => import("../components/SongListItem.vue");
const Scroll = () => import("../base/scorll.vue");
export default {
  components: {
    SongListItem,
    Scroll
  },
  computed: {
    bgimg() {
      if (this.playlist.backgroundCoverUrl == null) {
        return this.playlist.coverImgUrl;
      } else {
        return this.playlist.backgroundCoverUrl;
      }
    }
  },
  data: function() {
    return {
      //   playlistId: null,
      listLength: 20,
      playlist: null,
      scrollY: 0
    };
  },
  methods: {
    // 获取列表数据
    getPlayListDetail(id) {
      this.axios
        .get("http://junnaix.cn:7878/playlist/detail", {
          params: {
            id: id
          }
        })
        .then(reponse => {
          //   window.console.log(reponse.data);
          ({ playlist: this.playlist } = reponse.data);
        });
    },
    // 播放数转化
    translatePlayCount(n) {
      if (n > 99999999) {
        return (n / 100000000).toFixed(2) + "亿";
      }
      if (n > 9999) {
        return (n / 10000).toFixed(1) + "万";
      }
    },
    // 列表滚动监听
    scroll(pos) {
      this.scrollY = pos.y;
      this.listenScroll = true;
      window.console.log("111");
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    window.console.log('创建')
  },
  //   watch: {
  //       $route: function () {
  //           window.console.log(this.$route);
  //       }
  //   },

  beforeRouteEnter(to, from, next) {
    // window.console.log(to);
    // 路由进入 当前组件实例化之前就 拿数据
    // beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建
    next(vm => {
      vm.getPlayListDetail(to.query.id);
    });
  }
};
</script>

<style lang="less" scoped>

.img-box {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
  transform-origin: top;
  background-size: cover;
  background-position: 0 35%;

  .filter {
    height: 100%;
    width: 100%;
    filter: blur(40px);
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .listInfo {
    position: absolute;
    bottom: 5px;
    width: 100%;
    padding: 10px 20px;
    padding-bottom: 30px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    .title {
      display: -webkit-box;
      font-size: 16px;
      font-weight: bold;
      color: white;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      font-size: 12px;
      color: #dedede;
    }
    .fa {
      color: white;
      font-weight: 18px;
      margin-right: 5px;
    }
    .playCount {
      margin-top: 5px;
      color: white;
      font-size: 12px;
      vertical-align: middle;
    }
  }
}
.go-back {
  z-index: 999;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  height: 40px;
  line-height: 40px;
  font-size: 24px;
  padding: 0px 20px;
  span {
    font-size: 30px;
    color: white;
  }
}
.songlist {
  background: #f2f3f4;
  display: block;
  position: relative;
  top: -20px;
  border-radius: 20px;
  overflow: hidden;
}
</style>
