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

  // 計算要跳過幾筆
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

router.get('/detail/:prdId', async (req, res, next) => {
  // 商品細項用到的名稱
  let [detailData] = await pool.execute(
    'SELECT prd_list.id, prd_list.name, prd_list.price, prd_list.main_img, prd_list.disc, prd_type1_detail.cate_m, prd_type1_detail.cate_s, prd_list.rate, prd_type1_detail.brand,prd_type1_detail.capacity, prd_origin.name AS originName FROM prd_list JOIN prd_type1_detail on prd_list.id = prd_type1_detail.prd_id JOIN prd_origin ON prd_type1_detail.origin = prd_origin.id WHERE prd_list.id = ?',
    [req.params.prdId]
  );
  // console.log(detailData);

  console.log(detailData[0].cate_m);
  console.log(detailData[0].cate_s);

  // 中分類的 prd_detail_cate 的 Name (cate_m)
  let [cateMNameData] = await pool.execute('SELECT name FROM prd_detail_cate WHERE id = ?', [detailData[0].cate_m]);
  let cateMName = cateMNameData[0].name;
  // 小分類的 prd_detail_cate 的 Name (cate_s)
  let [cateSNameData] = await pool.execute('SELECT name FROM prd_detail_cate WHERE id = ?', [detailData[0].cate_s]);
  let cateSName = cateSNameData[0].name;

  detailData[0] = { ...detailData[0], cateMName, cateSName };

  let [detailImgData] = await pool.execute('SELECT url  FROM `prd_img` WHERE prd_id = ?', [req.params.prdId]);
  // console.log(detailImgData);

  // detailImgData.unshift(url: detailData[0].main_img);

  let detailImgList = [detailData[0].main_img];
  for (i = 0; i < detailImgData.length; i++) {
    detailImgList.push(detailImgData[i].url);
  }

  res.json({ detailData: [detailData[0]], detailImgList });
});
module.exports = router;
