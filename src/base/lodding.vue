<template>
  <div class="box">
    <div class="loader loader-box type2" :style="{ height: value + 'px', width: value + 'px' }">
      <div>
        <div>
          <div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value"]
};
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 180px;
  height: 180px;
  display: block;
  overflow: hidden;
  top: 50%;
  left: 50%;
}
.loader div {
  height: 100%;
}
.loader-box,
.loader-box div {
  box-sizing: border-box;
  padding: 10px;
  border-radius: 50%;
  border: 4px solid transparent;
}
.loader-box.type1,
.loader-box.type1 div {
  border-top-color: #ff01ff;
  border-right-color: #ff01ff;
  border-bottom-color: #ff01ff;
  animation: rotate2 linear 3.5s infinite;
}
.loader-box.type1:hover,
.loader-box.type1 div:hover {
  animation-play-state: paused;
}
.loader-box.type2,
.loader-box.type2 div {
  border-top-color: #e44d4d;
  border-left-color: #e44d4d;
  animation: rotate2 linear 3s infinite;
  animation-timing-function: cubic-bezier(0.55, 0.38, 0.21, 0.88);
}
.loader-box.type2:hover,
.loader-box.type2 div:hover {
  animation-play-state: paused;
}
.loader-box.type3,
.loader-box.type3 div {
  border-top-color: #ff01ff;
  animation: rotate2 linear 4s infinite;
}
.loader-box.type3:hover,
.loader-box.type3 div:hover {
  animation-play-state: paused;
}
@keyframes move1 {
  from {
    transform: rotate(0);
    box-shadow: 0px 0px 30px 5px rgba(100, 70, 143, 0.4);
  }
  to {
    transform: rotate(720deg);
    box-shadow: 0px 0px 30px 20px rgba(100, 70, 143, 0.4);
  }
}
@keyframes hidden {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotate2 {
  0% {
    transform: rotate(0);
    border-top-color: #e44d4d;
  }
  50% {
    transform: rotate(180deg);
    border-top-color: #ffffff;
  }
  100% {
    transform: rotate(360deg);
    border-top-color: #e44d4d;
  }
}
</style>
