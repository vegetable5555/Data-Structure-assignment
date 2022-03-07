const express = require('express')
const xlsx = require('xlsx')

/* 创建express对象 */
const app = express()
/* 读取表格数据 */
let workbook = xlsx.readFile('./public/data.xlsx')
let sheet = workbook.Sheets['Sheet1']
let data = xlsx.utils.sheet_to_json(sheet)

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
    //将数字型字符串转换为数字
    toInt(req.query)
    //获取前端响应参数对象的所有value，并添加到sheet中
    xlsx.utils.sheet_add_aoa(sheet, [Object.values(req.query)], { origin: -1 })
    xlsx.writeFile(workbook, './public/data.xlsx')
    data = xlsx.utils.sheet_to_json(sheet)
    res.send(data)
})

/* 响应删除操作 */
app.get('/remove', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let index = parseInt(Object.values(req.query)[0])
    console.log(index);
    data.splice(index, 1)
    sheet = xlsx.utils.json_to_sheet(data)
    workbook.Sheets['Sheet1'] = sheet
    xlsx.writeFile(workbook, './public/data.xlsx')
    res.send(data)
})

/* 响应修改操作 */
app.get('/edit', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let index = parseInt(req.query.index)
    let person = JSON.parse(req.query.person)
    data.splice(index,1,person)
    sheet = xlsx.utils.json_to_sheet(data)
    workbook.Sheets['Sheet1'] = sheet
    xlsx.writeFile(workbook, './public/data.xlsx')
    res.send(data)
})


/* 启动8080端口服务器 */
app.listen(8080, () => {
    console.log('http://127.0.0.1:8080端口服务器开始运行');
})