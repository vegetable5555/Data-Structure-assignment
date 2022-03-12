<template>
  <!-- 内容区 -->
  <div class="body-wrapper">
    <MyList
      v-show="this.$store.state.page === 1"
      :personList="personList"
      :sortedPersonList_date="sortedPersonList_date"
      :qSort_name="qSort_name"
      :binSearch = "binSearch"
    ></MyList>
    <!-- 这里用v-if是因为隐藏时echarts获取不到div的width和height，会产生warn -->
    <MyStatistics v-if="this.$store.state.page === 3"></MyStatistics>
    <MyAdd
      v-show="this.$store.state.page === 4"
      :personList="personList"
      :qSort_name="qSort_name"
      :binSearch = "binSearch"
    ></MyAdd>
    <!-- <button @click="update()">点我</button> -->
  </div>
</template>

<script>
import MyList from "./MyList.vue";
import MyAdd from "./MyAdd.vue";
import MyStatistics from "./MyStatistics.vue"
const axios = require("axios");
export default {
  name: "MyBody",
  components: {
    MyList,
    MyAdd,
    MyStatistics
  },
  data() {
    return {
      personList: [
        {
          name: "",
          age: "",
          birthplace: "",
          birthdate: "",
          deaddate: "",
          sex: "",
          height: "",
          education: "",
          job: "",
          father: "",
          mother: "",
          spelling: "",
        },
      ],
    };
  },
  methods: {
    //按出生年份对数组进行快速排序
    qSort_date(personList) {
      if (personList.length <= 0) {
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
      return this.qSort_date(left).concat(
        personList[pivotIndex],
        this.qSort_date(right)
      );
    },
    //按姓名拼音对数组进行快速排序
    qSort_name(personList) {
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
    // update(){
    //   axios.get("http://127.0.0.1:8080/update",{
    //     params:{
    //       personList:this.sortedPersonList_date
    //     }
    //   })
    // }
  },
  computed: {
    sortedPersonList_date() {
      return this.qSort_date(this.$store.state.personList);
    },
  },

  mounted() {
    axios.get("http://127.0.0.1:8080/get").then((value) => {
      this.$store.state.personList = this.qSort_name(value.data);
    });
    this.$bus.$on("removeData", (index) => {
      axios
        .get("http://127.0.0.1:8080/remove", {
          params: {
            index,
          },
        })
        .then((value) => {
          this.$store.state.personList = value.data;
        });
    });
    this.$bus.$on("addData", (index) => {
      axios.get("http://127.0.0.1:8080/add", {
        params: {
          index,
          person: this.$store.state.personList[index]
        },
      });
    });
    this.$bus.$on("editData", () => {
      axios.get("http://127.0.0.1:8080/edit", {
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