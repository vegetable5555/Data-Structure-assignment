<template>
  <div class="home-wrapper">
    <video class="video"
      src="../assets/home_video.mp4"
      autoplay
      loop
      muted
      type="mp4"
    ></video>
    <img src="../assets/home_bk.jpg" class="background"/>
    <span class="home_title">家谱管理系统</span>
    <span class="home_info">计科2班 陈旭展 202030440164</span>
  </div>
</template>

<script>
export default {
  name: "MyHome",
};
</script>

<style scope>
.home-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  padding: 280px 0;
  background: skyblue;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  user-select: none;
  mix-blend-mode: screen;
}

.video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home_title,
.home_info {
  position: relative;
  z-index: 3;
  color: var(--white);
  font-weight: bold;
}

.home_title {
  font-size: 7em;
  cursor: inherit;
}
</style>