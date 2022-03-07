<template>
  <div id="container">
    <Navigation></Navigation>
    <div class="main-wrapper" :class="{ active: show }">
      <MyHeader></MyHeader>
      <MyBody></MyBody>
      <MyFooter></MyFooter>
    </div>
  </div>
</template>


<script>
import Navigation from "./components/Navigation.vue";
import MyHeader from "./components/MyHeader.vue";
import MyBody from "./components/MyBody.vue";
import MyFooter from "./components/MyFooter.vue";

export default {
  name: "App",
  data() {
    return {
      show: false,
    };
  },
  components: {
    Navigation,
    MyHeader,
    MyBody,
    MyFooter,
  },
  mounted() {
    this.$bus.$on("toggleActive", (show) => {
      this.show = show
    });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --black: #222;
  --white: #fff;
  --grey: rgb(77, 76, 76);
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  position: relative;
  width: 100%;
  min-width: 800px;
}

/* 右部内容区容器 */
.main-wrapper {
  position: absolute;
  width: calc(100% - 300px);
  min-height: 100%;
  left: 300px;
  transition: 0.5s;
}

.main-wrapper.active {
  width: calc(100% - 100px);
  left: 100px;
}
</style>
