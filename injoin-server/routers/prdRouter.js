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

//大類別
router.get('/prdCate', async (req, res, next) => {
  let [prdMajorData] = await pool.execute('SELECT * FROM `prd_detail_cate` WHERE level = 1');
  let [prdMinorData] = await pool.execute('SELECT * FROM `prd_detail_cate` WHERE level = 2');
  let prdMajor = [];
  let prdMinor = [[], [], [], []];
  console.log(prdMinorData);
  prdMajor = prdMajorData.map((v, i) => {
    console.log(v);
    return v.name;
  });
  console.log(prdMinorData);
  prdMinorData.map((v) => {
    // console.log(v.name);
    switch (v.parent_id) {
      case 1:
        prdMinor[0].push(v.name);
        break;
      case 2:
        prdMinor[1].push(v.name);
        break;
      case 3:
        prdMinor[2].push(v.name);
        break;
      case 4:
        prdMinor[3].push(v.name);
        break;
    }
  });
  // console.log(prdMajor);
  // console.log(prdMinor);

  res.json({ prdMajor, prdMinor });
});
module.exports = router;
