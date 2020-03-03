<template>
  <li class="song" @click="setCurrentSongId(songItem.id)">
    <div class="left" v-if="index !== undefined">{{ index + 1 }}</div>
    <dl class="center">
      <dt>{{ songItem.name }}</dt>

      <!--  -->
      <dd v-if="songItem.song">
        <span v-if="songItem.song.hMusic && isShowQuality">SQ</span>
        {{ songItem.song.artists[0].name }}-{{ songItem.song.album.name }}
      </dd>
      <!--  -->
      <dd v-else-if="songItem.h">
        <span v-if="songItem.h && isShowQuality">SQ</span>
        {{ songItem.ar[0].name }}-{{ songItem.al.name }}
      </dd>
      <!--  -->
      <dd v-if="songItem.artists">{{ songItem.artists[0].name }}-{{ songItem.album.name }}</dd>
    </dl>
    <div class="right fa fa-play-circle-o"></div>
    <!-- <div>{{songItem}}</div> -->
  </li>
</template>

<script>
export default {
  props: ["songItem", "isShowQuality", "index"],
  methods: {
    setCurrentSongId(id) {
      this.$emit("translate-currentid", {
        id,
        showFullscreen: window.location.hash.match("search") ? true : false
      });
    }
  }
};
</script>

<style lang="less">
li.song {
  display: flex;
  padding: 5px 0px;
  dl.center {
    flex: 1;
    width: calc(100% - 100px);
    dt {
      line-height: 30px;
      white-space: nowrap;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      color: #333;
    }
    dd {
      line-height: 20px;
      font-size: 12px;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #888;
    }
  }
  .fa-play-circle-o{
      font-size: 28px;
      color: #AAAAAA;
  }
  .left,
  .right {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    flex-shrink: 0;
  }
  .left{
    font-size: 17px;
    color: #999;
  }
}
</style>
