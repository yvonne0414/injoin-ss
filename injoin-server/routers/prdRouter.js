const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
const { default: axios } = require('axios');

// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置
const storage = multer.diskStorage({
  // 設定儲存的目的地 （檔案夾）
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'production'));
  },
  // 重新命名使用者上傳的圖片名稱
  filename: function (req, file, cb) {
    let ext = file.originalname.split('.').pop();
    let newFilename = `${Date.now()}.${ext}`;
    cb(null, newFilename);
    // {
    //   fieldname: 'photo',
    //   originalname: 'japan04-200.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg'
    // }
  },
});
const uploader = multer({
  // 設定儲存的位置
  storage: storage,
  // 過濾圖片
  // 可以想成是 photo 這個欄位的「資料驗證」
  fileFilter: function (req, file, cb) {
    // console.log(file);
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/svg+xml') {
      cb('這些是不被接受的格式', false);
    } else {
      // cb(錯誤, 結果)
      cb(null, true);
    }
  },
  // 檔案尺寸的過濾
  // 一般不會上傳太大的圖片尺寸，以免到時候前端開啟得很慢
  limits: {
    // 1k = 1024
    fileSize: 1 * 1024 * 1024, //1MB
  },
});
// review 多張圖片上傳
const multi_upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .png, .jpg and .jpeg format allowed!');
      err.name = 'ExtensionError';
      return cb(err);
    }
  },
}).array('prdImg', 3);

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

// 新增商品
router.post('/', async (req, res) => {
  multi_upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res
        .status(500)
        .send({ error: { message: `Multer uploading error: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      // An unknown error occurred when uploading.
      if (err.name == 'ExtensionError') {
        res
          .status(413)
          .send({ error: { message: err.message } })
          .end();
      } else {
        res
          .status(500)
          .send({ error: { message: `unknown uploading error: ${err.message}` } })
          .end();
      }
      return;
    }

    let prdNum = req.body.prdNum;
    let name = req.body.name;
    let mainImg = req.files ? req.files[0].filename : '';
    let price = req.body.price;
    let disc = req.body.disc;
    let inventoryQuantity = req.body.inventoryQuantity;
    let category = req.body.category;
    let createTime = new Date();
    // let status = req.body.status;
    // prdlist (prd_num, name, main_img, price, disc, inventory_quantity, category, status)
    let [prdListResult] = await pool.execute(
      'INSERT INTO prd_list (prd_num, name, main_img, price, disc, inventory_quantity, category, status, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)',
      [prdNum, name, mainImg, price, disc, inventoryQuantity, category, createTime]
    );

    // imgList
    let imgList = req.files;
    for (i = 1; i < imgList.length; i++) {
      let img = imgList[i].filename;
      let [prdImgListResult] = await pool.execute('INSERT INTO prd_img (prd_id, url) VALUES (?, ?)', [prdListResult.insertId, img]);
    }

    // detail
    // 判斷category
    switch (Number(category)) {
      case 1:
        {
          let abv = req.body.abv;
          let origin = req.body.origin;
          let brand = req.body.brand;
          let capacity = req.body.capacity;
          let cateM = req.body.cate_m;
          let cateS = req.body.cate_s;

          let [type1Result] = await pool.execute('INSERT INTO prd_type1_detail (prd_id, abv, origin, brand, capacity, cate_m, cate_s) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            prdListResult.insertId,
            abv,
            origin,
            brand,
            capacity,
            cateM,
            cateS,
          ]);
        }
        break;
      case 2:
        {
          let origin = req.body.origin;
          let brand = req.body.brand;
          let capacity = req.body.capacity;
          let cateM = req.body.cate_m;

          let [type2Result] = await pool.execute('INSERT INTO prd_type2_detail (prd_id, origin, brand, capacity,cate_m) VALUES (?, ?, ?, ?, ?)', [
            prdListResult.insertId,
            origin,
            brand,
            capacity,
            cateM,
          ]);
        }
        break;
      case 3:
      case 4:
        {
          let origin = req.body.origin;
          let capacity = req.body.capacity;
          let mater = req.body.mater;
          let cateM = req.body.cate_m;

          let [type3Result] = await pool.execute('NSERT INTO prd_type3_detail (prd_id, origin, capacity, mater, cate_m) VALUES (?, ?, ?, ?, ?)', [
            prdListResult.insertId,
            origin,
            capacity,
            mater,
            cateM,
          ]);
        }
        break;
    }

    // console.log(req.files);
    // console.log(req.body);
    res.status(200).json({ code: 0, result: 'ok' });
  });
});

module.exports = router;
