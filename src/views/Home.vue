<template>
  <div class="home">
    <div class="top"><h3>MUSIC</h3></div>
    <ul class="nav">
      <li>
        <router-link to="/recommend">推荐音乐</router-link>
      </li>
      <li>
        <router-link :to="{ path: '/hot' }">热门榜单</router-link>
      </li>
      <li>
        <router-link to="/search">搜索</router-link>
      </li>
    </ul>
    <keep-alive>
      <router-view
        @translate-currentid="$emit('translate-currentid', $event)"
        class="bgc"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {}
};
</script>

<style lang="less">
.top {
  padding: 0px 10px;
  background-color: #d43c33;
  h3 {
    text-align: center;
    font-weight: bold;
    color: #e4e4e4;
    line-height: 45px;
    letter-spacing: 2px;
  }
}
.bgc {
  background-color: #fcfcfd;
}
ul.nav {
  display: flex;
  background-color: #d43c33;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 10px;
  li {
    flex: 1;
    text-align: center;
    height: 41px;
    a {
      line-height: 40px;
      display: inline-block;
      color: #e4e4e4;
      &:active {
        color: white;
      }
      &.router-link-exact-active {
        font-weight: bold;
        color: white;
        border-bottom: 2px solid white;
      }
    }
  }
}
</style>
