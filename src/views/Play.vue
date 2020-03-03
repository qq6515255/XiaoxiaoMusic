<template>
  <div class="play" v-if="playList.length">
    <div class="filter-bg"></div>
    <div class="filter" :style="'background-image:url(' + bgimg + ')'"></div>
    <!-- 头部 -->
    <div class="go-back">
      <span
        class="fa fa-angle-left"
        aria-hidden="true"
        @click.stop="$emit('playshow', false)"
      ></span>
      <h3>{{ playList[currentIndex].al.name }}</h3>
      <h3
        class="singer"
        @click="
          $router.push('/Singer?id=' + playList[currentIndex].ar[0].id), $emit('playshow', false)
        "
      >
        {{ playList[currentIndex].ar[0].name }}
      </h3>
    </div>
    <div class="mid">
      <div class="box">
        <!-- 旋转唱片 -->
        <div
          class="img-box"
          :class="{ no: showLyric, stop: isPaused }"
          @click="showLyric = !showLyric"
        >
          <div class="border">
            <img :src="bgimg" alt />
          </div>
        </div>
        <!-- 歌词 -->
        <div class="word-box" :class="{ no: !showLyric }" @click="showLyric = !showLyric"></div>
      </div>
    </div>
    <!-- 底部控制部分 -->
    <div class="contrl">
      <div class="lineBox">
        <!-- <div class="song-line">
          <div class="ball"></div>
          <div class="active-line"></div>
        </div> -->
        <progressLine :percent="percent" @percentChange="setProgress" :btnWidth="6"></progressLine>
        <span class="now-time left">{{ nowTime }}</span>
        <span class="end-time right">{{ duringTime }}</span>
      </div>
      <!-- 按钮部分 -->
      <div class="btn-box">
        <div
          class="fa"
          @click="changePlayMode"
          :class="{
            'fa-refresh': playMode === 2,
            'fa-random': playMode === 3,
            'fa-retweet': playMode === 1
          }"
        ></div>
        <div class="fa fa-step-backward" @click="prev"></div>
        <div
          class="fa"
          :class="{ 'fa-play-circle': isPaused, 'fa-pause-circle': !isPaused }"
          @click="togglePlaying"
        ></div>
        <div class="fa fa-step-forward" @click="next"></div>
        <div class="fa-gratipay fa"></div>
      </div>
    </div>
    <!-- mini -->
    <div class="mini" @click="$emit('playshow', true)">
      <div class="img-box" :class="{ stop: isPaused }">
        <img :src="bgimg" alt />
      </div>
      <div class="title">
        <h3>{{ playList[currentIndex].al.name }}</h3>
        <h4>{{ playList[currentIndex].ar[0].name }}</h4>
      </div>
      <div class="fa fa-bars" aria-hidden="true"></div>
      <div class="progress" @click.stop="togglePlaying">
        <progresscCircle class="mini-control" :radius="radius" :percent="percent">
          <div class="fa" :class="{ 'fa-play': isPaused, 'fa-pause': !isPaused }"></div>
        </progresscCircle>
      </div>
    </div>
    <audio
      id="music-audio"
      ref="audio"
      autoplay
      @canplay="ready(), (isPaused = false)"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>
// @error="error"
<!-- autoplay -->
<script>
const progresscCircle = () => import("../base/progress-cri");
import progressLine from "../base/progress";

export default {
  props: {
    // 外部传来的歌曲ID单首
    playIdList: {
      type: Number,
      default: null
    },
    playerInfo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isPaused: true,
      radius: 50,
      playList: [],
      songIdlist: [],
      currentTime: 0,
      percent: 0,
      songReady: false,
      currentIndex: 0,
      url: "",
      playingLyric: "",
      showLyric: false,
      currentLyric: null,
      playMode: 2
      // 1 列表循环  2 单曲循环  3 随机播放
    };
  },
  computed: {
    bgimg() {
      if (this.playList[0] === undefined) {
        return "";
      } else {
        return this.playList[this.currentIndex].al.picUrl;
      }
    },
    nowTime() {
      return [parseInt((this.currentTime / 60) % 60), parseInt(this.currentTime % 60)]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    },
    duringTime() {
      return [
        parseInt((this.playList[this.currentIndex].dt / 60000) % 60),
        parseInt((this.playList[this.currentIndex].dt / 1000) % 60)
      ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    }
  },
  components: {
    progresscCircle,
    progressLine
  },

  watch: {
    playIdList(newList) {
      let index = this.songIdlist.indexOf(newList);
      if (index === -1) {
        this.getPlaySongInfo(newList);
        this.currentIndex = 0;
      } else {
        window.console.log("enter");
        this.currentIndex = index;
      }
    },
    isPaused() {
      if (this.isPaused) {
        this.$el.querySelector("audio").pause();
      } else {
        this.$el.querySelector("audio").play();
      }
    },
    // 监听url变化
    url(newUrl) {
      this.$refs.audio.src = newUrl;
      let time = setInterval(() => {
        if (this.duration && this.songReady) {
          this.isPaused = false;
          clearInterval(time);
        }
      }, 150);
      // 本地存储
      window.console.log('url')
      this.setPlayerInfo();
    },
    // 索引改变时
    currentIndex(newindex) {
      window.console.log('indexxxx')
      this.getPlaySongUrl(this.songIdlist[newindex]);
    },
    // 播放器信息监听
    PlayerInfo(){
    // this.$root.$children[0].playerInfo=this.playerInfo
      window.console.log('aasdadas')
    }
  },
  created() {
    window.console.log(this);
    window.console.log("创建player=>获取数据", this.playerInfo);
    // 初始化本地存储

    if (this.playerInfo.playList === undefined) {
      this.setPlayerInfo();
    } else {
      this.getPlayerInfo();
    }
  },
  methods: {
    setPlayerInfo() {
      window.console.log('set1')
      this.$set(this.playerInfo, 'playList', this.playList);
      this.$set(this.playerInfo, 'songIdlist', this.songIdlist);
      this.$set(this.playerInfo, 'currentIndex', this.currentIndex);
      this.$set(this.playerInfo, 'currentLyric', this.currentLyric);
      this.$set(this.playerInfo, 'songIdlist', this.songIdlist);
      // this.$emit('updata-playerInfo',this.playerInfo);
      
  
    },
    getPlayerInfo() {
      this.playList = this.playerInfo.playList;
      this.songIdlistthis=this.playerInfo.songIdlist;
      this.currentIndex = this.playerInfo.currentIndex;
      this.currentLyric = this.playerInfo.currentLyric;
      this.songIdlist=this.playerInfo.songIdlist;
      this.getPlaySongUrl(this.playList[this.currentIndex].id);
    },
    // 获取url
    getPlaySongUrl(id) {
      this.songReady = false;
      this.percent = 0;
      this.axios
        .get("http://junnaix.cn:7878/song/url", {
          params: {
            id
          }
        })
        .then(Response => {
          window.console.log(Response.data.data);
          this.url = Response.data.data[0].url;
        });
    },
    // 获取歌曲详细信息
    getPlaySongInfo(ids) {
      this.axios
        .get("http://junnaix.cn:7878/song/detail", {
          params: {
            ids
          }
        })
        .then(Response => {
          // this.playList.unshift(Response.data.data[0]);
          this.songIdlist.unshift(Response.data.songs[0].id);
          this.playList.unshift(Response.data.songs[0]);
          this.getPlaySongUrl(this.playList[0].id);
          window.console.log(this.playList);
        });
    },

    // 监听歌曲当前进度
    updateTime(e) {
      if (this.move) {
        return;
      }
      this.currentTime = e.target.currentTime;
      this.percent = (this.currentTime * 1000) / this.playList[this.currentIndex].dt;
    },
    // 歌曲状态
    ready() {
      this.songReady = true;
      // this.togglePlaying();
      window.console.log("ready");
    },
    // 设置进度方法
    setProgress(percent) {
      // 根据子组件传过来的百分比设置播放进度
      this.$refs.audio.currentTime = this.$refs.audio.duration * percent;
      // 拖动后设置歌曲播放
      // if (!this.playing) {
      //   this.togglePlaying();
      // }
    },
    togglePlaying() {
      const audio = this.$refs.audio;
      // this.setisPaused(isPaused);
      this.isPaused ? audio.play() : audio.pause();
      window.console.log("audio.paused===>", audio.paused);
      this.isPaused = audio.paused;
      // if (this.currentLyric) {
      //   this.currentLyric.togglePlay()
      // }
    },
    // 播放模式改变
    changePlayMode() {
      if (this.playMode + 1 > 3) {
        this.playMode = 1;
      } else {
        this.playMode++;
      }
    },
    // 结束监听事件
    end() {
      if (this.playMode !== 3) {
        this.loop();
      }
    },
    //循环方法
    loop() {
      if (this.playMode === 2) {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      } else {
        this.next();
      }
    },
    // 上一首
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.currentIndex - 1 < 0) {
        this.currentIndex = this.songIdlist.length - 1;
      } else {
        this.currentIndex--;
      }
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.currentIndex + 1 > this.songIdlist.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.no {
  visibility: hidden;
}
.clearfix() {
  display: block;
  zoom: 1;

  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
.play {
  position: fixed;
  z-index: 9999;
  &.minioff {
    top: 0;
  }
  height: 100vh;
  width: 100%;
  background-color: rgb(255, 255, 255);
  .mini {
    padding: 5px 10px;
    top: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: none;

    .img-box {
      float: left;
      height: 100%;
      width: 50px;
      margin-right: 10px;
      animation: transfRate 10s linear infinite;
      &.stop {
        animation-play-state: paused;
      }
      img {
        display: block;
        width: 100%;
        border-radius: 50%;
      }
    }
    .title {
      float: left;
      height: 100%;
      width: 55%;
      overflow: hidden;
      padding: 5px 10px;
      h3 {
        line-height: 20px;
      }
      h4 {
        color: #636060;
        line-height: 20px;
        font-size: 12px;
      }
    }
    .progress {
      float: right;
      width: 50px;
      height: 100%;
      line-height: 50px;
      text-align: center;
      font-size: 25px;
      position: relative;
      .fa {
        position: absolute;
        font-size: 16px;
        top: 17px;
        left: 19px;
        color: hsla(0, 0%, 7%, 0.6);
      }
    }
    .mini-control {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    .fa-bars {
      text-align: center;
      float: right;
      width: 50px;
      height: 100%;
      line-height: 50px;
      font-size: 20px;
      color: hsla(0, 0%, 7%, 0.6);
    }
  }
  &.miniOn {
    top: none;
    bottom: 0;
    height: 60px;
    .mini {
      display: block;
    }
    .go-back,
    .mid,
    .contrl {
      display: none;
    }
  }
  .filter-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .filter {
    width: 100%;
    height: 100%;
    filter: blur(15px);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    opacity: 0.5;
    z-index: -1;
  }
}
.go-back {
  z-index: 999;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  line-height: 50px;
  font-size: 24px;
  padding: 10px 20px;
  overflow: hidden;
  text-align: center;

  span {
    font-size: 30px;
    color: white;
    float: left;
  }
  h3 {
    height: 25px;
    line-height: 30px;
    display: block;
    font-size: 18px;
    font-weight: 800;
    color: white;
  }
  .singer {
    font-weight: 400;
    font-size: 12px;
  }
}
.mid {
  width: 100%;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  position: fixed;
  top: 70px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  .box {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
    .img-box {
      height: 100%;
      width: 80%;
      position: absolute;
      left: 10%;
      top: 0;
      border-radius: 50%;
      animation: transfRate 10s linear infinite;
      &.stop {
        animation-play-state: paused;
      }
      .border {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 15px solid hsla(0, 0%, 40%, 0.5);
        border-radius: 50%;
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
          display: block;
        }
      }
    }
    .word-box {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
.contrl {
  overflow: hidden;
  position: absolute;
  bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px 0px;
  .lineBox {
    width: 70%;
    position: relative;
    touch-action: none;
    .left {
      position: absolute;
      left: -50px;
      top: 2px;
    }
    .right {
      position: absolute;
      right: -48px;
      top: 2px;
    }
    span {
      text-align: center;
      display: inline-block;
      min-width: 5px;
      min-height: 12px;
      padding: 3px;
      border-radius: 5px;
      font-size: 10px;
      color: #ffffff;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .btn-box {
    display: flex;
    width: 100%;
    padding: 20px 50px;
    justify-content: center;
    div {
      flex: 1;
      text-align: center;
      font-size: 28px;
      vertical-align: middle;
      line-height: 28px;
      cursor: pointer;
    }
    .fa-play-circle {
      font-size: 45px;
    }
    .fa-pause-circle {
      font-size: 45px;
    }
  }
}
@keyframes transfRate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
