// 利用 epxress 來建立一個 express application
const express = require('express');
const app = express();

const path = require('path');

// 使用第三方開發的中間件 cors，允許跨域
const cors = require('cors');
app.use(cors());

const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 為了 pool 新增的參數
    connectionLimit: 10,
    dateStrings: true,
  });

// RESTful API
// 取得商品
app.get('/', (req,res) => {
  res.send('home')
})

app.get('/prdlist', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM `prd_list`');
  res.json(data);
});

// 會跳到最下方 5xx error
app.get('/error', (req, res, next) => {
  // 發生錯誤，你丟一個錯誤出來
  // throw new Error('測試測試');
  // 或是你的 next 裡有任何參數
  next('我是正確的');
  // --> 都會跳去錯誤處理中間件
});

// 404
app.use((req, res, next) => {
  // console.log('所有路由的後面 ==> 404', req.path);
  res.status(404).send('Not Found');
});

// 5xx 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('來自四個參數的錯誤處理中間件', req.path, err);
  res.status(500).send('Server Error: 請洽系統管理員');
});

app.listen(3001, () => {
  console.log('Server start at 3001');
});
