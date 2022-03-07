<template>
  <div class="add-wrapper">
    <el-form
      :model="person"
      :rules="rules"
      ref="addPerson"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="姓名" prop="name" required>
        <el-input v-model="person.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age" required>
        <el-input v-model.number="person.age"></el-input>
      </el-form-item>
      <el-form-item label="出生地" prop="birthplace" required>
        <el-input v-model="person.birthplace"></el-input>
      </el-form-item>
      <el-form-item label="出生日期" required>
        <el-form-item prop="birthdate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="person.birthdate"
            style="width: 100%"
            value-format="yyyy.M.d"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="死亡日期">
        <el-form-item prop="deaddate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="person.deaddate"
            style="width: 100%"
            value-format="yyyy.M.d"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="性别" prop="sex" required>
        <el-radio-group v-model="person.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身高" prop="height" required>
        <el-input v-model.number="person.height"></el-input>
      </el-form-item>
      <el-form-item label="学历" prop="education" required>
        <el-input v-model="person.education"></el-input>
      </el-form-item>
      <el-form-item label="职业" prop="job" required>
        <el-input v-model="person.job"></el-input>
      </el-form-item>
      <el-form-item label="父亲" prop="father" required>
        <el-input v-model="person.father"></el-input>
      </el-form-item>
      <el-form-item label="母亲" prop="mother" required>
        <el-input v-model="person.mother"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addPerson')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('person')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "MyAdd",
  props: ["personList"],
  data() {
    return {
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
          { required: true, message: "请输入名字", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        age: [
          { required: true, message: "请输入年龄" },
          { type: "number", message: "年龄必须为数字值" },
        ],
        birthplace: [
          { required: true, message: "请输入出生地", triiger: "blur" },
        ],
        birthdate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        height: [
          { required: true, message: "请输入身高" },
          { type: "number", message: "身高必须为数字值" },
        ],
        education: [{ required: true, message: "请输入学历", trigger: "blur" }],
        job: [{ required: true, message: "请输入职业", trigger: "blur" }],
        father: [
          { required: true, message: "请输入父亲名字", trigger: "blur" },
        ],
        mother: [
          { required: true, message: "请输入母亲名字", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.person.deaddate === ""){
            this.person.deaddate = "在世"
          }
          this.personList.push(this.person)
          this.$bus.$emit('addData')
          alert("添加成功");
        } else {
          console.log("Error");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      console.log(this.person);
    },
  },
};
</script>

<style>
.add-wrapper {
  width: 100%;
  height: 800px;
}

.el-form.demo-ruleForm {
  padding-top: 50px;
  padding-left: 150px;
}

.el-form-item {
  width: 40%;
  min-width: 300px;
}
</style>