<template>
  <!-- 内容区 -->
  <div class="body-wrapper">
    <MyList
      v-show="this.$store.state.page === 1"
      :personList="personList"
    ></MyList>
    <MyAdd
      v-show="this.$store.state.page === 4"
      :personList="personList"
    ></MyAdd>
  </div>
</template>

<script>
import MyList from "./MyList.vue";
import MyAdd from "./MyAdd.vue";
const axios = require("axios");
export default {
  name: "MyBody",
  components: {
    MyList,
    MyAdd,
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
        },
      ],
    };
  },
  mounted() {
    axios.get("http://127.0.0.1:8080/get").then((value) => {
      this.personList = value.data;
    });
    this.$bus.$on("removeData", (index) => {
      axios
        .get("http://127.0.0.1:8080/remove", {
          params: {
            index,
          },
        })
        .then((value) => {
          this.personList = value.data;
        });
    });
    this.$bus.$on("addData", () => {
      axios.get("http://127.0.0.1:8080/add", {
        params: {
          ...this.personList[this.personList.length - 1],
        },
      });
    });
    this.$bus.$on("editData", (index) => {
      axios.get("http://127.0.0.1:8080/edit", {
        params: {
          index,
          person: this.personList[index],
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