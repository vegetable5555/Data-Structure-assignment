<template>
  <!-- 左侧导航区 -->
  <div class="nav-wrapper" :class="{active:show}">
    <div class="nav-title">
      <i class="el-icon-tickets"></i>
      <span>目录</span>
    </div>
    <ul>
      <li @click="add_active(1)" :class="{active:this.$store.state.page === 1}">
        <i class="el-icon-user-solid"></i><span>我的家族</span>
      </li>
      <li @click="add_active(2)" :class="{active:this.$store.state.page === 2}">
        <i class="el-icon-share"></i><span>家族树</span>
      </li>
      <li @click="add_active(3)" :class="{active:this.$store.state.page === 3}">
        <i class="el-icon-s-data"></i><span>信息统计</span>
      </li>
      <li @click="add_active(4)" :class="{active:this.$store.state.page === 4}">
        <i class="el-icon-edit-outline"></i><span>添加人员</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data(){
    return {
      show: false,
    }
  },
  methods: {
    add_active(index){
      this.$store.commit('changePage',index)
    },
  },
  mounted(){
    this.$bus.$on('toggleActive',(show) => {
      this.show = show
    })
  }
};
</script>

<style scope>
/* 导航区域 */
.nav-wrapper {
  position: fixed;
  width: 300px;
  height: 100%;
  background: var(--black);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition: 0.5s;
}

.nav-wrapper .nav-title {
  position: absolute;
  display: flex;
  margin-top: 40px;
  color: var(--white);
  font-size: 2.5em;
  margin-bottom: 30px;
}

.nav-wrapper .nav-title i {
  font-size: 1.5em;
  text-align: center;
  margin-right: 10px;
  transition: 0.5s;
}

.nav-wrapper.active .nav-title i{
  margin-right: 120px;
}

.nav-wrapper ul {
  position: relative;
  top: 120px;
  width: 100%;
  list-style: none;
  font-size: 1.5em;
  color: var(--white);
}

.nav-wrapper ul li {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px 0 0 25px;
  text-align: left;
  line-height: 50px;
  padding-left: 50px;
  background: var(--black);
  margin-top: 35px;
  cursor: pointer;
  transition: 0.2s;
}

.nav-wrapper.active ul li{
  padding-left: 30px;
}

.nav-wrapper ul li i{
  transition: 0.5s;
}

.nav-wrapper.active ul li i{
  margin-right: 50px;
}

.nav-wrapper ul li i {
  font-size: 1.5em;
  margin-right: 10px;
  vertical-align: middle;
}

.nav-wrapper ul li:hover {
  background: var(--white);
  color: var(--black);
  box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.6),
    inset 0px -5px 5px rgba(0, 0, 0, 0.4);
}

.nav-wrapper ul li.active {
  background: var(--white);
  color: var(--black);
  box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.6),
    inset 5px 5px 5px rgba(0, 0, 0, 0.4);
}
</style>