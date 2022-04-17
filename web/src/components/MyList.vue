<template>
  <div class="list-wrapper">
    <!-- 人员查找 -->
    <div class="op-wrapper">

      <!-- 两个button用于切换当前展示人员列表的排序方式  PS：两种不同的排列方式分别用不同的列表存储，所以只是切换了展示的列表，并没有对列表重新进行排序 -->
      <el-button v-if="!sorted" @click="sorted = true" type="info" round
        >按出生年份排序</el-button
      >
      <el-button v-if="sorted" @click="sorted = false" type="info" round
        >默认排序</el-button
      >

      <!-- 搜索框容器 -->
      <div class="search-wrapper">

        <span>姓名：</span>

        <!-- 利用【@keydown】方便用户直接按下回车进行查找 -->
        <el-input
          v-model="searchName"
          @keydown.enter.native="search"
        ></el-input>

        <!-- 除了利用回车也可点击按钮进行查找 -->
        <el-button @click="search" type="info" round
          ><i class="el-icon-search"></i><span>查找</span></el-button
        >
      </div>
    </div>

    <!-- 人员信息展示 -->
    <!-- 总体结构为一个动态表格，【：data】属性动态绑定了表格的展示数据，可以动态规定展示的数据是按名字排序、按出生年份排序的列表，还是查找的人员信息 -->
    <el-table
      :data="
        sorted
          ? sortedPersonList_date
          : searching
          ? searchPerson
          : this.$store.state.personList
      "
      style="width: 100%"
      :current-row-key="1"
    >
    <!-- 定义展示数据的不同字段，通过【prop】属性会自动填充数据 -->
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="birthplace" label="出生地"> </el-table-column>
      <el-table-column prop="birthdate" label="出生日期"> </el-table-column>
      <el-table-column prop="deaddate" label="死亡日期"> </el-table-column>
      <el-table-column prop="sex" label="性别"> </el-table-column>
      <el-table-column prop="height" label="身高"> </el-table-column>
      <el-table-column prop="education" label="学历"> </el-table-column>
      <el-table-column prop="job" label="职业"> </el-table-column>
      <!-- 最后一列为编辑按钮和删除按钮所在列，利用【v-if】可以控制按钮只有在按名字排序（即默认排序时）才渲染显示 -->
      <el-table-column v-if="!sorted" fixed="right" label="操作">
        <template slot-scope="scope">
          <!-- 点击编辑按钮时，将展示一个修改信息的表单窗口 -->
          <el-button
            class="edit"
            type="info"
            size="small"
            @click="
              dialogFormVisible = true;
              editIndex = scope.$index;
              getPerson();
            "
            >编辑</el-button
          >
          <!-- 【el-popconfirm】在用户点击删除按钮时会出现confirm气泡框，避免用户误操作 -->
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="remove(scope.$index)"
          >
            <el-button
              class="delete"
              slot="reference"
              type="danger"
              size="small"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 该按钮为用户提供退出查找页面的接口 -->
    <el-button
      class="exit-search"
      @click="
        searching = false;
        searchName = '';
      "
      type="text"
      v-if="searching"
      >显示全部人员</el-button
    >

    <!-- 编辑人员信息的表单窗口 -->
    <el-dialog title="人员信息" :visible.sync="dialogFormVisible">
      <!-- 表单中的人员信息利用【v-model】动态绑定组件中的person数据中的信息 -->
      <el-form inline ref="editPerson" :rules="rules" :model="person">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="person.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="person.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出生地" prop="birthplace">
          <el-input v-model="person.birthplace" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthdate">
          <el-input v-model="person.birthdate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="死亡日期" prop="deaddate">
          <el-input v-model="person.deaddate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身高" prop="height">
          <el-input
            v-model.number="person.height"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <!-- 性别采用单选框形式 -->
          <el-radio-group v-model="person.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="person.education" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职业" prop="job">
          <el-input v-model="person.job" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父亲" prop="father">
          <el-input v-model="person.father" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="母亲" prop="mother">
          <el-input v-model="person.mother" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="info"
          @click="
            dialogFormVisible = false;
            submitForm('editPerson');
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入拼音模块，便于将中文名字转为拼音，进行排序和检索
import { pinyin } from "pinyin-pro";
export default {
  //组件名字
  name: "MyList",

  //通过【MyBody】组件传入了：1. 按年份排序的人员列表  2. 按名字的快速排序函数  3. 按名字二分查找函数
  props: ["sortedPersonList_date", "qSort_name", "binSearch"],

  //组件中的数据
  data() {
    return {
      //编辑人员信息窗口是否显示
      dialogFormVisible: false,
      //为true时人员列表按出生年份排序
      sorted: false,
      //存储用户搜索的人员名字
      searchName: "",
      //记录用户点击编辑的人员的检索位置
      editIndex: 0,
      //记录用户搜索的人员在列表中的检索位置
      searchIndex: 0,
      //为true时展示的是搜索的人员信息，false时展示所有成员
      searching: false,
      //记录搜索人员的信息，并显示在查找页面中
      searchPerson: [],
      //修改人员信息时先对其进行一次深拷贝，防止数据随着用户的输入在提交前便改变
      person: {
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
        pid:"",
        id:""
      },

      //定义表单校验的规则
      rules: {
        name: [
          //【required】设置是否为必填项
          //【message】设置当校验不通过时展示的提醒信息
          //【trigger】设置什么时候进行校验，“blur”表示失去焦点时
          { required: true, message: "名字不能为空", trigger: "blur" },
          //【min】和【max】分别设置该项所填的最小及最大长度
          { min: 2, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        age: [
          //【type】规定所填值的类型
          { required: true, message: "年龄不能为空" },
          { type: "number", message: "年龄必须为数字值" },
        ],
        birthplace: [
          { required: true, message: "出生地不能为空", triiger: "blur" },
        ],
        birthdate: [
          {
            required: true,
            message: "出生日期不能为空",
            trigger: "change",
          },
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "change" }],
        height: [
          { required: true, message: "身高不能为空" },
          { type: "number", message: "身高必须为数字值" },
        ],
        education: [
          { required: true, message: "学历不能为空", trigger: "blur" },
        ],
        job: [{ required: true, message: "职业不能为空", trigger: "blur" }],
        father: [
          { required: true, message: "父亲名字不能为空", trigger: "blur" },
        ],
        mother: [
          { required: true, message: "母亲名字不能为空", trigger: "blur" },
        ],
      },
    };
  },

  //组件中的方法
  methods: {

    //删除按钮的回调函数
    remove(index) {
      //不在查找页面时，利用回调函数传入的index，直接对人员列表进行操作
      if (!this.searching) {
        //触发事件总线上的【removedata】事件，从而同步后台的数据
        this.$bus.$emit("removeData", index);
      }
      //当前处于查找页面，主要利用二分查找查找出待删除人员的检索位置
      else{
        let deleteIndex = this.binSearch(this.searchPerson[0].spelling)
        //触发事件总线上的【removedata】事件，从而同步后台的数据
        this.$bus.$emit("removeData", deleteIndex)
      }
    },

    //编辑按钮的回调函数，深拷贝所选人员信息，避免数据随用户输入而变更
    getPerson() {
      //当前不处于查找页面，index为【editIndex】
      if (!this.searching) {
        //对人员信息进行深拷贝，存储在this.person中
        this.person = JSON.parse(
          JSON.stringify(this.$store.state.personList[this.editIndex])
        );
      } 
      //当前处于查找页面，index为【searchIndex】
      else {
        this.person = JSON.parse(
          JSON.stringify(this.$store.state.personList[this.searchIndex])
        );
      }
    },

    //修改提交点击回调函数
    submitForm(formName) {
      //当前不处于查找页面
      if (!this.searching) {
        //利用【$refs】获取到表单元素，然后调用【validate】方法进行校验，参数为回调函数，【valid】为一个boolean值，true表示校验成功
        this.$refs[formName].validate((valid) => {
          //校验通过
          if (valid) {
            //更新person人员信息的【spelling】属性
            this.person.spelling = pinyin(this.person.name, {
              toneType: "none",
            })
              .split(" ")
              .join("");

            //将修改的信息同步到【store】中
            this.$store.state.personList.splice(this.editIndex, 1, this.person);

            //将修改后的personList重新进行以此快排
            this.$store.state.personList = this.qSort_name(
              this.$store.state.personList
            );

            //触发事件总线上的【editData】事件，从而同步后台的数据
            this.$bus.$emit("editData");
            alert("修改成功");
          } 
          //校验失败
          else {
            return false;
          }
        });
      }

      //当前处于查找页面
      else {
        //利用【$refs】获取到表单元素，然后调用【validate】方法进行校验，参数为回调函数，【valid】为一个boolean值，true表示校验成功
        this.$refs[formName].validate((valid) => {
          //校验通过
          if (valid) {
            //更新person人员信息的【spelling】属性
            this.person.spelling = pinyin(this.person.name, {
              toneType: "none",
            })
              .split(" ")
              .join("");
            
            //将修改的信息同步到【store】中
            this.$store.state.personList.splice(
              this.searchIndex,
              1,
              this.person
            );

            //将修改后的personList重新进行以此快排
            this.$store.state.personList = this.qSort_name(
              this.$store.state.personList
            );

            //触发事件总线上的【editData】事件，从而同步后台的数据
            this.$bus.$emit("editData", this.searchIndex);
            alert("修改成功");

            //同步查找页面中展示的人员信息
            this.searchPerson.splice(0, 1, this.person);
          } 
          //校验失败
          else {
            return false;
          }
        });
      }
    },

    //查询按钮的回调函数
    search() {
      //判断人员列表中是否有人
      if (this.$store.state.personList.length === 0) {
        alert("当前系统内未存储人员信息！");
        //清空搜索框内容
        this.searchName = "";
        return;
      }

      //判断搜索框内是否为空
      if (this.searchName === "") {
        alert("查询人员名字不能为空！");
        return;
      } 
      //搜索框不为空，进行搜索操作
      else {

        //统一在查询时将页面转化为默认排序的界面，才能显示删除和编辑按钮
        this.sorted = false;

        //获取查找的人员在列表中的【index】值，利用二分查找
        this.searchIndex = this.binSearch(
          //将查询人员的名字的拼音作为参数进行查找
          pinyin(this.searchName, { toneType: "none" }).split(" ").join("")
        );

        //未找到
        if (this.searchIndex === -1) {
          alert("系统不存在此人，请检查名字是否输入正确！");
          //清空输入框
          this.searchName = "";
          return;
        }

        //找到
        //展示查询人员
        this.searching = true;
        //更新查询人员的数据，这里使用splice而不是直接push的原因是可能有残留数据
        this.searchPerson.splice(
          0,
          1,
          this.$store.state.personList[this.searchIndex]
        );

        //清空输入框
        this.searchName = "";
      }
    },
  },

  //生命周期函数，当页面的组件挂载完毕后执行
  mounted() {
    //在Date的原型上绑定一个格式化时间的方法
    Date.prototype.format = function (date) {
    //将日期格式化为xxxx.xx.xx
      return (
        date.getFullYear() + "." + date.getMonth() + 1 + "." + date.getDate()
      );
    };
  },
};
</script>

<style scope>
.op-wrapper {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: space-between;
}

.op-wrapper .el-button {
  width: 146px;
  height: 40px;
  font-weight: bold;
  margin-left: 30px;
}

.op-wrapper .search-wrapper .el-button {
  margin-right: 20px;
  font-size: 1em;
}

.op-wrapper .el-button i {
  margin-left: -5px;
}

.search-wrapper {
  display: flex;
  align-items: center;
}

.search-wrapper span {
  width: 100px;
}

.exit-search {
  margin-top: 50px;
  margin-left: calc(50% - 42px);
}

/* 调整编辑按钮样式 */
.edit {
  margin-right: 10px;
}

/* 调整询问框样式 */
.el-popover {
  width: 250px;
  position: absolute;
  right: 0px;
  border-radius: 5px;
  background: var(--white);
  margin-right: 200px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

.el-popconfirm {
  width: 100%;
}

.el-popconfirm__main {
  margin: 20px;
  width: 100%;
}

.el-popconfirm__action {
  margin: 20px;
  width: 200px;
}

.el-popconfirm__action .el-button--text {
  color: var(--black);
}

.el-popconfirm__action .el-button--primary {
  color: var(--white);
  background-color: var(--grey);
}
</style>