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
        <el-button type="info" @click="submitForm('addPerson')"
          >立即创建</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//引入【pinyin-pro】包，方便将中文名字转换为拼音
import { pinyin } from "pinyin-pro";

export default {
  //组件的名字
  name: "MyAdd",

  //注册由父组件传递的方法或属性，这里注册的是快排函数及二分查找函数
  props: ["qSort_name", "binSearch"],

  //定义组件中的数据
  data() {
    return {
      //临时存储新增人员的信息
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
        id:"",
        pid:"",
        descendants: "",
      },

      //表单的检验规则
      rules: {
        name: [
          //【required】属性定义是否为必填项
          //【message】属性定义报错提示信息
          //【trigger】属性定义校验表单时机，“blur”表示失去焦点时
          { required: true, message: "请输入名字", trigger: "blur" },
          //【min】和【max】属性定义所填字符的最大及最小值
          { min: 2, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        age: [
          { required: true, message: "请输入年龄" },
          //【type】属性定义所填数据的类型
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

  //定义组件中的方法
  methods: {
    submitForm(formName) {
      //检验表单
      this.$refs[formName].validate((valid) => {
        //表单检验通过
        if (valid) {
          //找到其父亲的检索位置
          let fatherIndex = this.binSearch(
            pinyin(this.person.father, { toneType: "none" }).split(" ").join("")
          );

          //判断其父亲是否在家谱中
          if (fatherIndex === -1) {
            alert("当前家谱无法找到该父亲，请确认名字是否输入正确！");
            return false;
          } 
          //其父亲在家谱中，进行后续操作
          else {
            //更新新增人员【pid】属性，为父亲的【id】属性
            this.person.pid = this.$store.state.personList[fatherIndex].id

            //更新父亲的descendants属性
            this.$store.personList[fatherIndex].descendants++;

            //触发事件总线上的【editData】事件，将该人员的父亲信息同步
            this.$bus.$emit('editData',fatherIndex)

            //更新自己的【id】属性
            this.person.id = ++this.$store.state.maxId
            //后台中的【maxId】值会在触发【addData】事件时同步更新

            //将未去世的人的死亡日期改为【在世】
            if (this.person.deaddate === "") {
              this.person.deaddate = "在世";
            }

            //在该组件的【person】中更新【spelling】属性
            this.person.spelling = pinyin(this.person.name, {
              toneType: "none",
            }).split(" ").join("");

            //将新添加的人员信息后插入personList中
            this.$store.state.personList.push(
              JSON.parse(JSON.stringify(this.person))
            );

            //对personList再次进行快排，保证数据有序
            this.$store.state.personList = this.qSort_name(
              this.$store.state.personList
            );

            //找到更新后新增人员的位置，触发【addData】事件，便于后台将数据写入表格
            let insIndex = this.binSearch(
              pinyin(this.person.name, { toneType: "none" }).split(" ").join("")
            );
            this.$bus.$emit("addData", insIndex);
            alert("添加成功");

            //将表单清空
            this.$refs[formName].resetFields();
          }
        }
        //表单检验不通过
        else {
          console.log("Error");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.add-wrapper {
  width: 100%;
  height: 100%;
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