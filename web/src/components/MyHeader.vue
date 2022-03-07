<template>
  <!-- 顶部 -->
  <div class="header-wrapper">
    <div class="toggle">
      <i v-show="!show" @click="changeShow" class="el-icon-s-fold"></i>
      <i v-show="show" @click="changeShow" class="el-icon-s-unfold"></i>
    </div>
    <span class="title">我的家族</span>
    <div class="user">
      <img src="../assets/user.png" />
      <span>用户信息</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyHeader",
  data(){
    return {
      show:false
    }
  },
  methods: {
    changeShow(){
      this.show = !this.show
      this.$bus.$emit('toggleActive',this.show)
    }
  },
};
</script>

<style>
/* 头部区域 */
.header-wrapper {
  width: 100%;
  height: 60px;
  background: var(--black);
  position: relative;
}

.header-wrapper .toggle {
  position: absolute;
  width: 60px;
  height: 60px;
  font-size: 3em;
  color: var(--white);
}

.header-wrapper .toggle i {
  cursor: pointer;
}

.header-wrapper .title {
  position: absolute;
  left: 70px;
  display: block;
  background: var(--white);
  border-radius: 8px;
  width: 120px;
  height: 50px;
  margin-top: 5px;
  line-height: 50px;
  font-size: 1.5em;
  color: var(--black);
  text-align: center;
}

.header-wrapper .user {
  position: absolute;
  top: 10px;
  right: 30px;
  display: flex;
  width: 200px;
  align-items: center;
  justify-content: space-around;
}

.header-wrapper .user img {
  display: block;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.header-wrapper .user span {
  color: var(--white);
  font-size: 1.25em;
}
</style>