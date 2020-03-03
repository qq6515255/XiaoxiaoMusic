<template>
  <div class="search">
    <label class="search-input">
      <input
        ref="input"
        type="text"
        v-model.trim="inputValue"
        @focus="(inputing = true), resetSearch()"
        @keyup.enter="enter()"
      />
      <button @click="inputValue = null" class="reset"></button>
    </label>

    <!-- 热门推荐模块 -->
    <div class="hot" v-show="!inputValue">
      <h5>热门搜索</h5>
      <ul class="keywords">
        <li v-for="(item, index) in hotSearchKeyWords" :key="index" @click="enter(item.first)">
          {{ item.first }}
        </li>
      </ul>
    </div>
    <div class="history Suggests" v-show="!inputValue">
      <h5>历史搜索</h5>
      <ul class="keywords">
        <li v-for="(item, index) in historyList" :key="index" @click="enter(item)">
          <i class="fa fa-history"></i>
          <span>{{ item }}</span>
          <i class="fa fa-times" @click.stop="deleteHistory(index)"></i>
        </li>
      </ul>
    </div>

    <!-- 建议的词条 -->
    <template v-if="inputValue && !searchMultimatch && inputing !== false">
      <ul class="Suggests">
        <li class="title">搜索"{{ inputValue }}"</li>
        <li v-for="(item, index) in searchSuggests" :key="index" @click="enter(item.keyword)">
          <i class="fa fa-search"></i>
          <span>{{ item.keyword }}</span>
        </li>
      </ul>
    </template>

    <div
      class="multimatch"
      v-if="searchMultimatch && inputValue !== null && inputValue !== '' && inputing !== true"
    >
      <h3 class="title">最佳匹配</h3>
      <template v-if="searchMultimatch.artist">
        <div
          class="artist"
          v-for="item in searchMultimatch.artist"
          :key="item.id"
          @click="$router.push('/Singer?id=' + item.id)"
        >
          <img :src="item.picUrl" alt />
          <h5>歌手: {{ item.name }}</h5>
          <span class="fa fa-angle-right"></span>
        </div>
      </template>

      <template
        v-if="searchMultimatch.mv && inputValue !== null && inputValue !== '' && inputing !== true"
      >
        <div class="mv artist" v-for="item in searchMultimatch.mv" :key="item.id">
          <img :src="item.cover" alt />
          <h5>
            <p>MV: {{ item.name }}</p>
            <p>{{ item.artistName }}</p>
          </h5>
          <span class="fa fa-angle-right"></span>
        </div>
      </template>
    </div>

    <ul v-if="searchSongs && inputValue !== null && inputValue !== '' && inputing !== true">
      <SongListItem
        v-for="item in searchSongs"
        :key="item.id"
        :songItem="item"
        @translate-currentid="$emit('translate-currentid', $event)"
      ></SongListItem>
    </ul>
    <Lodding v-if="loading" :value="180"></Lodding>
  </div>
</template>

<script>
import SongListItem from "../components/SongListItem";
import Lodding from "../base/lodding";
export default {
  name: "HomeSearch",
  components: {
    SongListItem,
    Lodding
  },
  data() {
    return {
      inputing: false,
      hotSearchKeyWords: [],
      inputValue: null,
      searchSuggests: [],
      loading: false,
      searchMultimatch: null,
      searchSongs: [],
      historyList: []
    };
  },
  methods: {
    resetSearch() {
      (this.searchMultimatch = null), (this.searchSongs = []);
    },
    enter(value) {
      this.inputing = false;
      if (value) {
        this.inputValue = value;
      }
      this.getHistory(this.inputValue);
      window.console.log("enter", value);
      this.getSearchMultimatch();
      this.getSearchSongs();
      this.$refs.input.blur();
    },
    getHistory(value) {
      let index = this.historyList.indexOf(value);
      if (index === -1) {
        this.historyList.unshift(value);
      } else {
        let temp = this.historyList[index];
        this.historyList.splice(index, 1);
        this.historyList.unshift(temp);
      }

      this.$root.$children[0].historylist = this.historyList;
    },
    deleteHistory(index) {
      this.historyList.splice(index, 1);
      this.$root.$children[0].historylist = this.historyList;
    },
    getHotSearch() {
      this.axios.get("http://junnaix.cn:7878/search/hot").then(response => {
        ({ hots: this.hotSearchKeyWords } = response.data.result);
      });
    },
    getSearchSuggest() {
      this.inputValue;
      this.axios
        .get("http://junnaix.cn:7878/search/suggest", {
          params: {
            keywords: this.inputValue,
            type: "mobile"
          }
        })
        .then(response => {
          window.console.log(response);

          ({ allMatch: this.searchSuggests } = response.data.result);
        });
    },
    getSearchMultimatch() {
      this.loading = true;
      this.axios
        .get("http://junnaix.cn:7878/search/multimatch", {
          params: {
            keywords: this.inputValue
          }
        })
        .then(response => {
          ({ result: this.searchMultimatch } = response.data);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getSearchSongs() {
      this.loading = true;
      this.axios
        .get("http://junnaix.cn:7878/search", {
          params: {
            keywords: this.inputValue,
            limit: 5,
            offset: 0
          }
        })
        .then(response => {
          ({ songs: this.searchSongs } = response.data.result);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getHotSearch();
    // 获取APP层的搜索历史
    this.historyList=this.$root.$children[0].historylist;
    
  },
  watch: {
    inputValue(newValue) {
      if (newValue) {
        this.getSearchSuggest();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.bgc {
  background-color: #fbfcfd !important;
}

.search {
  padding: 0 10px;
  min-height: 100vh;
  .search-input {
    position: relative;
    input {
      width: 100%;
      background-color: #ebecec;
      padding: 0 25px;
      outline: none;
      height: 30px;
      border-radius: 60px;
      border: none;
      margin: 15px 0px;
    }
    &::before,
    .reset {
      content: "";
      width: 14px;
      height: 14px;
      position: absolute;
      top: 5px;
      left: 8px;
      background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==");
    }
    .reset {
      left: auto;
      right: 8px;
      border: none;
      outline: none;
      background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjYmNiZGJkIiBkPSJNMTQgMGM3LjczMiAwIDE0IDYuMjY4IDE0IDE0cy02LjI2OCAxNC0xNCAxNFMwIDIxLjczMiAwIDE0IDYuMjY4IDAgMTQgMHoiLz48cGF0aCBkPSJNMTkgOUw5IDE5TTkgOWwxMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWJlY2ViIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIi8+PC9nPjwvc3ZnPg==");
    }
  }

  .hot {
    h5 {
      padding: 15px 0px;
      font-size: 12px;
      line-height: 12px;
      color: #666;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    .keywords {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0px;
      li {
        padding: 0 10px;
        margin: 0 10px 8px 0;
        border-radius: 15px;
        border: 1px solid #d3d4da9c;
        font-size: 14px;
        line-height: 32px;
        height: 32px;
      }
    }
  }
  .history {
    h5 {
      padding: 15px 0px;
      font-size: 12px;
      line-height: 12px;
      color: #666;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .multimatch {
    padding: 10px 0px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    border-top: 1px solid rgba(0, 0, 0, 0.03);
    letter-spacing: 1px;
    .title {
      font-size: 12px;
      line-height: 12px;
      color: #666;
    }

    .artist {
      margin-top: 10px;
      display: flex;
      line-height: 50px;
      img {
        width: 50px;
        height: 50px;
      }
      h5 {
        flex: 1;
        white-space: nowrap;
        width: calc(100% - 120px);
        margin-left: 15px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span {
        height: 50px;
        width: 50px;
        flex: 0 0 auto;
        text-align: center;
        line-height: 50px;
        font-size: 28px;
        color: #aaaaaa;
      }
    }

    .mv {
      display: flex;
      line-height: 50px;
      img {
        width: 50px;
        height: 50px;
        display: block;
      }
      h5 {
        flex: 1;
        p {
          &:first-child {
            line-height: 30px;
          }
          &:last-child {
            line-height: 20px;
          }
        }
      }
      span {
        height: 50px;
        width: 50px;
        flex: 0 0 auto;
        text-align: center;
        line-height: 50px;
        font-size: 28px;
        color: #aaaaaa;
      }
    }
  }

  // 搜索提示样式
  .Suggests {
    .title {
      height: 50px;
      padding-right: 10px;
      font-size: 15px;
      line-height: 50px;
      color: #507daf;
    }
    li {
      align-items: center;
      height: 45px;
      padding-left: 10px;
      display: flex;
      border-style: solid;
      border-width: 0px 0px 1px 0px;
      border-color: rgba(0, 0, 0, 0.1);
      i {
        font-size: 15px;
        flex: 0 0 auto;
        margin-right: 10px;
        color: #bfbfbf;
      }
      span {
        display: inline-block;
        flex: 1;
        width: 1%;
        padding-right: 10px;
        font-size: 15px;
        line-height: 45px;
        font-weight: 400;
        color: #333;
      }
    }
  }
  .history {
    li {
      border-width: 0px;
      i {
        font-size: 20px;
      }
      span {
        border-style: solid;
        border-width: 0px 0px 1px 0px;
        border-color: rgba(0, 0, 0, 0.03);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
