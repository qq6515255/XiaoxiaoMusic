<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      ></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 进度条按钮宽度,由于style中没有设置width,因此只能用clientWidth获取
export default {
 data() {
  return {
   touchInfo: {
    initiated: false
   }
  }
 },
 props: {
  percent: {
   type: Number,
   default: 0
  },

    btnWidth: {
    type: Number,
    default: 12
   },
 },
 mounted() {
 },
 methods: {
  // 点击按钮
  progressTouchStart(e) {
   // 记录touch事件已经初始化
   this.touchInfo.initiated = true;
   // 点击位置
   this.touchInfo.startX = e.touches[0].pageX;
   // 点击时进度条长度
   this.touchInfo.left = this.$refs.progress.clientWidth;
  },
  // 开始移动
  progressTouchMove(e) {
   if (!this.touchInfo.initiated) {
    return
   }
   // 计算移动距离
   const moveX = e.touches[0].pageX - this.touchInfo.startX
   // 设置偏移值
   const offsetWidth = Math.min(Math.max(0, this.touchInfo.left + moveX),
    this.$refs.progressBar.clientWidth - this.btnWidth)
   this._setOffset(offsetWidth)
  },
  // 移动结束
  progressTouchEnd() {
   this.touchInfo.initiated = false
   // 向父组件派发事件,传递当前百分比值
   this._triggerPercent()
  },
  // 进度条点击事件
  progressClick(e) {
   // 设置进度条及按钮偏移
   window.console.log(e);
   this._setOffset(e.offsetX)
   // 通知父组件播放进度变化
   this._triggerPercent()
  },
  _triggerPercent() {
   
   const barWidth = this.$refs.progressBar.clientWidth - this.btnWidth
   const percent = Math.min(1, this.$refs.progress.clientWidth / barWidth)
   this.$emit('percentChange', percent)
  },
  // 设置偏移
  _setOffset(offsetWidth) {
   // 设置进度长度随着百分比变化
   this.$refs.progress.style.width = `${offsetWidth}px`
   // 设置按钮随着百分比偏移
   this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth-6}px, 0, 0)`
  }
 },
 watch: {
  // 监听歌曲播放百分比变化
  percent(newPercent) {
   if (newPercent > 0 && !this.touchInfo.initiated) {
    // 进度条总长度
    const barWidth = this.$refs.progressBar.clientWidth - this.btnWidth
    const offsetWidth = barWidth * newPercent
    // 设置进度条及按钮偏移
    this._setOffset(offsetWidth)
   }
  }
 }
}
 //  rel="stylesheet/stylus"
</script>

<style lang="less" scoped>
.progress-bar {
  position: relative;
  .bar-inner {
    margin: 10px 0px;
    display: block;
    position: relative;
    line-height: 40px;
    width: 100%;
    height: 6px;
    background-color: rgba(78, 77, 77, 0.5);
    border-radius: 5px;
    .progress {
      position: absolute;
      height: 100%;
      border-radius: 5px;
      background-color: rgb(232, 60, 60);
    }
    .progress-btn-wrapper {
      position: relative;
      box-sizing: border-box;
      height: 12px;
      width: 12px;
      border: 3px solid #ffffff;
      border-radius: 50%;
      background-color: rgb(232, 60, 60);
      top: -3px;
      
    }
  }
}
</style>
