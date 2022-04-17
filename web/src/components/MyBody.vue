<template>
  <!-- 内容区 -->
  <div class="body-wrapper">
    <!-- 我的家族页面 -->
    <MyList
      v-show="this.$store.state.page === 1"
      :sortedPersonList_date="sortedPersonList_date"
      :qSort_name="qSort_name"
      :binSearch="binSearch"
    ></MyList>

    <!-- 家族树页面 -->
    <MyTree v-if="this.$store.state.page === 2" ></MyTree>

    <!-- 信息统计页面 -->
    <!-- 这里用v-if是因为隐藏时echarts获取不到div的width和height，会产生warn -->
    <MyStatistics v-if="this.$store.state.page === 3"></MyStatistics>

    <!-- 添加人员页面 -->
    <MyAdd
      v-show="this.$store.state.page === 4"
      :qSort_name="qSort_name"
      :binSearch="binSearch"
    ></MyAdd>
  </div>
</template>

<script>
//引入各个页面子组件
import MyList from "./MyList.vue";
import MyAdd from "./MyAdd.vue";
import MyStatistics from "./MyStatistics.vue";
import MyTree from "./MyTree.vue";

//引入axios模块，用于向服务器发送请求
const axios = require("axios");
export default {
  //组件名字
  name: "MyBody",

  //注册子组件
  components: {
    MyList,
    MyAdd,
    MyStatistics,
    MyTree,
  },

  //组件中的数据
  // data() {
  //   return {
  //     personList: [
  //       {
  //         name: "",
  //         age: "",
  //         birthplace: "",
  //         birthdate: "",
  //         deaddate: "",
  //         sex: "",
  //         height: "",
  //         education: "",
  //         job: "",
  //         father: "",
  //         mother: "",
  //         spelling: "",
  //         pid:"",
  //         id:""
  //       },
  //     ],
  //   };
  // },
  methods: {
    //按出生年份对数组进行快速排序
    qSort_date(personList) {
      //人员列表长度过小，无需排序
      if (personList.length <= 1) {
        return personList;
      }

      let pivotIndex = Math.floor(personList.length / 2);
      let left = [];
      let right = [];
      for (let i = 0; i < personList.length; i++) {
        if (i === pivotIndex) continue;
        if (
          new Date(personList[i].birthdate).getFullYear() <
          new Date(personList[pivotIndex].birthdate).getFullYear()
        ) {
          left.push(personList[i]);
        } else {
          right.push(personList[i]);
        }
      }

      //这里利用递归调用，将right和left数组再次调用快排后拼接，【concat】用于将多个数组拼接为一个数组
      return this.qSort_date(left).concat(
        personList[pivotIndex],
        this.qSort_date(right)
      );
    },

    //按姓名拼音对数组进行快速排序
    qSort_name(personList) {
      //人员列表长度过小，无需排序
      if (personList.length <= 0) {
        return personList;
      }

      let pivotIndex = Math.floor(personList.length / 2);
      let left = [];
      let right = [];
      for (let i = 0; i < personList.length; i++) {
        if (i === pivotIndex) continue;
        if (personList[i].spelling < personList[pivotIndex].spelling) {
          left.push(personList[i]);
        } else {
          right.push(personList[i]);
        }
      }

      //这里利用递归调用，将right和left数组再次调用快排后拼接，【concat】用于将多个数组拼接为一个数组
      return this.qSort_name(left).concat(
        personList[pivotIndex],
        this.qSort_name(right)
      );
    },

    //二分查找法按人名拼音查找人员函数
    binSearch(value) {
      let l = 0,
        r = this.$store.state.personList.length - 1;
      while (l < r) {
        let mid = Math.floor(l + (r - l) / 2);
        if (value === this.$store.state.personList[mid].spelling) {
          return mid;
        }
        if (value > this.$store.state.personList[mid].spelling) {
          l = mid + 1;
        } else {
          r = mid - 1;
        }
      }
      return value === this.$store.state.personList[l].spelling ? l : -1;
    },
  },

  //计算属性
  computed: {
    //按出生年份排序的人员列表，作为props传递给MyList组件
    sortedPersonList_date() {
      //按照出生年份进行快速排序
      return this.qSort_date(this.$store.state.personList);
    },
  },

  //生命周期函数，组件挂载完毕后调用
  mounted() {
    //发送get请求，请求人员列表数据，并且共享在store上
    axios.get("http://127.0.0.1:8080/get").then((value) => {
      //为保证数据正确性，对响应的数据进行以此快排
      this.$store.state.personList = this.qSort_name(value.data);
    });

    //发送get请求，请求当前人员列表中最大的Id值，便于在用户添加人员时准确设置其id属性
    axios.get("http://127.0.0.1:8080/getMaxId").then((value) => {
      this.$store.state.maxId = value.data.maxId;
    })

    //在事件总线上绑定【removeData】事件，同时接收一个index参数
    this.$bus.$on("removeData", (index) => {
      //发送get请求，对【index】位置的人员进行删除操作
      axios
        .get("http://127.0.0.1:8080/remove", {
          params: {
            index,
          },
        })
        //同时同步当前store上的数据
        .then((value) => {
          this.$store.state.personList = value.data;
        });
    });

    //在事件总线上绑定【addData】事件，同时接收一个index参数
    this.$bus.$on("addData", (index) => {
      //发送get请求，在【index】位置插入添加的人员
      axios.get("http://127.0.0.1:8080/add", {
        //传递插入位置【index】以及添加人员对象【person】为参数
        params: {
          index,
          person: this.$store.state.personList[index],
        },
      });
    });

    //在事件总线上绑定【editData】事件
    this.$bus.$on("editData", () => {
      axios.get("http://127.0.0.1:8080/edit", {
        //将更新后的【personList】直接作为参数
        params: {
          personList: this.$store.state.personList,
        },
      });
    });
  },
};
</script>

<style>
/* 内容区域 */
.body-wrapper {
  width: 100%;
  min-height: 800px;
  background: var(--white);
  padding: 0 10px;
}
</style>