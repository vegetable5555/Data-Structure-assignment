<template>
  <div class="list-wrapper">
    <!-- 人员信息展示 -->
    <el-table
      :data="personList"
      height="700"
      style="width: 100%"
      :current-row-key="1"
    >
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
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            class="edit"
            type="info"
            size="small"
            @click="
              dialogFormVisible = true;
              selectIndex = scope.$index;
              getPerson();
            "
            >编辑</el-button
          >
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

    <!-- 编辑人员信息窗口 -->
    <el-dialog title="人员信息" :visible.sync="dialogFormVisible">
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
export default {
  name: "MyList",
  props: ["personList"],
  data() {
    return {
      dialogFormVisible: false,
      selectIndex: 0,
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
      },
      rules: {
        name: [
          { required: true, message: "名字不能为空", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        age: [
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
  methods: {
    //删除按钮回调函数
    remove(index) {
      this.$bus.$emit("removeData", index);
    },
    //深拷贝所选人员信息
    getPerson() {
      this.person = JSON.parse(
        JSON.stringify(this.personList[this.selectIndex])
      );
    },
    //修改提交点击回调函数
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.personList.splice(this.selectIndex, 1, this.person);
          alert("修改成功");
          this.$bus.$emit("editData", this.selectIndex);
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    Date.prototype.format = function (date) {
      return (
        date.getFullYear() + "." + date.getMonth() + 1 + "." + date.getDate()
      );
    };
  },
};
</script>

<style>
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