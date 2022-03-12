const express = require('express')
const xlsx = require('xlsx')

//按姓名拼音对数组进行快速排序
let qSort_name = function(personList) {
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
    return qSort_name(left).concat(
      personList[pivotIndex],
      qSort_name(right)
    );
  }

/* 创建express对象 */
const app = express()
/* 读取表格数据 */
let workbook = xlsx.readFile('./public/data.xlsx')
let sheet = workbook.Sheets['Sheet1']
let data = qSort_name(xlsx.utils.sheet_to_json(sheet))

/* 处理query参数中的数字参数 */
let toInt = function (obj) {
    obj['age'] = parseInt(obj['age'])
    obj['height'] = parseInt(obj['height'])
}

/* 响应表格中的数据 */
app.get('/get', (req, res) => {
    // //设置响应头    设置允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    // //响应头
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.send(data)
})

/* 响应增添操作 */
app.get('/add', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let index = parseInt(req.query.index)
    let person = JSON.parse(req.query.person)
    //将数字型字符串转换为数字
    toInt(person)
    data.splice(index,0,person)
    sheet = xlsx.utils.json_to_sheet(data)
    workbook.Sheets['Sheet1'] = sheet
    xlsx.writeFile(workbook,'./public/data.xlsx')
})

/* 响应删除操作 */
app.get('/remove', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let index = parseInt(Object.values(req.query)[0])
    data.splice(index, 1)
    sheet = xlsx.utils.json_to_sheet(data)
    workbook.Sheets['Sheet1'] = sheet
    xlsx.writeFile(workbook, './public/data.xlsx')
    res.send(data)
})

/* 响应修改操作 */
app.get('/edit', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let personList = req.query.personList
    for(let i = 0; i < personList.length; i++){
        personList[i] = JSON.parse(personList[i])
    }
    data = personList
    sheet = xlsx.utils.json_to_sheet(data)
    workbook.Sheets['Sheet1'] = sheet
    xlsx.writeFile(workbook, './public/data.xlsx')
})

/* 响应更新全表操作 */
// app.get('/update',(req,res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     let temp = []
//     for(let i = 0; i < req.query.personList.length; i++){
//         temp.push(JSON.parse(req.query.personList[i]))
//     }
//     sheet = xlsx.utils.json_to_sheet(temp)
//     workbook.Sheets['Sheet1'] = sheet
//     xlsx.writeFile(workbook,'./public/data.xlsx')
// })


/* 启动8080端口服务器 */
app.listen(8080, () => {
    console.log('http://127.0.0.1:8080端口服务器开始运行');
})