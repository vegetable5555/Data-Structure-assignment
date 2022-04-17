<template>
  <div class="tree-wrapper">
    <el-button type="info" @click="changeDirection">{{horizontal ? '纵向' : '横向'}}</el-button>
    <zm-tree-org
      :data="tree"
      :disabled="disaled"
      :horizontal="horizontal"
      :collapsable="collapsable"
      :label-style="style"
      :node-draggable="true"
      :node-draging="nodeDragMove"
      :node-drag-end="nodeDragEnd"
      :define-menus="null"
    >
      <!-- 自定义节点内容 -->
      <template slot-scope="{node}">
          <div class="tree-org-node__text node-label">{{node.name}}</div>
        </template>
      <!-- 自定义展开按钮 -->
      <!-- <template v-slot:expand="{node}">
          <div>{{node.children.length}}</div>
        </template> -->
    </zm-tree-org>
  </div>
</template>

<script>
export default {
  name: "MyTree",
  data() {
    return {
      personList: JSON.parse(JSON.stringify(this.$store.state.personList)),
      map: [],
      //存储家族树的数据
      tree: {},
      toolBar: {
        scale: false,
      },
      //家族树的排列方向
      horizontal: false,
      //家族树是否可以展开节点
      collapsable: true,
      //家族树是否全部默认展开
      expandAll: true,
      //家族树是否可编辑
      disaled: true,

      style: {
        background: "rgb(144,144,144)",
        color: "#fff",
        fontSize: "20px",
        borderRadius: "10px",
        border: "solid 2px rgb(120,120,120)"
      },
    };
  },
  methods: {
    changeDirection(){
      this.horizontal = !this.horizontal
    },
    nodeDragMove(data) {
      console.log(data);
    },
    nodeDragEnd(data, isSelf) {
      console.log(data, isSelf);
      isSelf && this.$Message.info("移动到自身");
    },
    expandChange() {
      this.toggleExpand(this.data, this.expandAll);
    },
    //节点展开或闭合函数
    //利用递归思想，给整个家族树的节点添加属性【expand】同时设为true或者false
    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          this.$set(item, "expand", val);
          if (item.children) {
            this.toggleExpand(item.children, val);
          }
        });
      } else {
        this.$set(data, "expand", val);
        if (data.children) {
          this.toggleExpand(data.children, val);
        }
      }
    },
  },
  mounted() {
    this.personList.forEach((person) => {
      this.map[person.id] = person;
    });
    this.personList.forEach((person) => {
      delete person.age;
      delete person.birthplace;
      delete person.deaddate;
      delete person.birthdate;
      delete person.sex;
      delete person.height;
      delete person.education;
      delete person.job;
      delete person.father;
      delete person.mother;
      delete person.spelling;
      delete person.generation;

      let father = this.map[person.pid];
      //父亲存在
      if (father) {
        (father.children || (father.children = [])).push(person);
      }
      //不存在父亲，即家族树【root】
      else {
        this.tree = person;
      }
    });
    this.toggleExpand(this.personList, this.expandAll);
  },
};
</script>

<style>
.tree-wrapper{
    width: 100%;
    height: 800px;
}

.el-button{
  border-radius: 10px;
  margin-top: 5px;
  margin-left: 25px;
}
</style>