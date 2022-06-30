const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

router.get('/prdList', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;

  let [allData, fields] = await pool.execute('SELECT * FROM `prd_list` WHERE status = 1 AND category= ?', [req.query.category]);

  // 總數
  const total = allData.length;

  // 計算總頁數
  const perPage = 16; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let [pageData] = await pool.execute('SELECT * FROM `prd_list` WHERE status = 1 AND category= ?  LIMIT ? OFFSET ?', [req.query.category, perPage, offset]);
  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});


router.get('/prdCate', async (req, res, next) => {
  // 大類別
  let [majorPrdSelData] = await pool.execute('SELECT * FROM `prd_detail_cate` WHERE level = 1');
  // 中類別
  let [subPrdSelData] = await pool.execute('SELECT * FROM `prd_detail_cate` WHERE level = 2');
  // 小類別
  let [thirdPrdSelData] = await pool.execute('SELECT * FROM `prd_detail_cate` WHERE level = 3');
  let majorPrdSel = [];
  let subPrdSel = [[], [], [], []];
  let thirdPrdSel = [];
  console.log(majorPrdSelData);
  majorPrdSel = majorPrdSelData.map((v, i) => {
    console.log(v);
    return v.name;
  });
  console.log(subPrdSelData);
  subPrdSelData.map((v) => {
    // console.log(v.name);
    switch (v.parent_id) {
      case 1:
        subPrdSel[0].push(v.name);
        break;
      case 2:
        subPrdSel[1].push(v.name);
        break;
      case 3:
        subPrdSel[2].push(v.name);
        break;
      case 4:
        subPrdSel[3].push(v.name);
        break;
    }
  });
  // thirdPrdSel.map((v) => {
  //   switch (v.parent_id)
  // });


  res.json({ majorPrdSel, subPrdSel });
});
module.exports = router;
