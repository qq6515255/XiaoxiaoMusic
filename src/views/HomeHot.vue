<template>
  <div>
    <topList
      v-for="(item, index) in listInfo"
      :key="index"
      :top="item"
      @translate-currentid="$emit('translate-currentid', $event)"
    ></topList>
  </div>
</template>

<script>
const topList = () => import("../components/topList.vue");
const YUNMUSIC_TOP = [0, 1, 2, 3, 4, 15, 14, 22, 30];
export default {
  data() {
    return {
      listInfo: []
    };
  },
  components: {
    topList
  },
  methods: {
    getToplist() {
      YUNMUSIC_TOP.forEach(element => {
        this.axios
          .get("http://junnaix.cn:7878/top/list", {
            params: {
              idx: element
            }
          })
          .then(reponse => {
            //   window.console.log(reponse.data);
            let list = reponse.data.playlist;
            list.top = reponse.data.playlist.tracks.slice(0, 3);
            // ({ list: this.listInfo } = reponse.data);
            this.listInfo.push(list);
          });
      });
    }
  },
  created() {
    this.getToplist();
  }
};
</script>

<style lang="less"></style>
