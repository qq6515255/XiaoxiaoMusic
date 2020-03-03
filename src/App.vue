<template>
  <div id="app">
    <keep-alive>
      <router-view @translate-currentid="getcurrentSong" :class="{ 'pdb-65': !Playershow }" />
    </keep-alive>
    <!-- 播放器 -->
    <Player
      :class="{ minioff: Playershow, miniOn: !Playershow }"
      :playIdList="currentSongIdList"
      :playerInfo="playerInfo"
      @playshow="showitem"
      @updata-playerInfo="savePlayerInfo"
    ></Player>
  </div>
</template>

<script>
import Player from "./views/Play";
export default {
  data() {
    return {
      currentSongIdList: null,
      Playershow: true,
      local: {},
      historylist:[],
      playerInfo:{}
    };
  },
  watch: {
    historylist(){
      this.local.historylist=this.historylist;
      localStorage.setItem("music", JSON.stringify(this.local))
    },

  },
  components: {
    Player
  },
  created() {
    // 本地存储的读取
    let localData = localStorage.getItem("music");
    // window.console.log("localData ==> ", localData);
    this.local = localData ? JSON.parse(localData) : {};
    this.getPlayerInfo();
    this.getHistory();
  },
  methods: {
    savePlayerInfo(e){
      window.console.log('appChange');
      this.local.playerInfo=e;
      localStorage.setItem("music", JSON.stringify(this.local))
    },
    getcurrentSong(obj) {
      this.currentSongIdList = obj.id;
      this.Playershow = true;
    },
    showitem(e) {
      window.console.log(e);
      this.Playershow = e;
    },
    getHistory(){
      if (this.local.historylist===undefined) {
        this.historylist=[];
      }else{
        this.historylist=this.local.historylist;
      }
    },
    getPlayerInfo(){
      if (this.local.playerInfo===undefined) {
        this.playerInfo={};
      }else{
        this.playerInfo=this.local.playerInfo;
      }
    },
  }
};
</script>
<style>
.pdb-65 {
  padding-bottom: 65px;
}
a {
  color: #2c3e50;
  text-decoration: none;
}
.on {
  z-index: 999;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  height: 0;
  height: 100%;
  width: 100%;
}
</style>
