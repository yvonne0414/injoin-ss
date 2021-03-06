const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
const { default: axios } = require('axios');
const { log } = require('console');

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
  limits: { fileSize: 3 * 1024 * 1024 }, // 1MB
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
}).array('prdImg[]', 5);

// 商品列表
router.get('/prdList', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;
  let orderById = req.query.orderById || 1;
  let orderBy = 'price ASC';
  let category = Number(req.query.category);
  let cateM = Number(req.query.cateM) || 0;
  let cateS = Number(req.query.cateS) || 0;
  let keyword = req.query.keyword || '';
  let userId = req.query.userId || -1;

  switch (Number(orderById)) {
    case 1:
      orderBy = 'price ASC';
      break;
    case 2:
      orderBy = 'price DESC';
      break;
    case 3:
      orderBy = 'rate ASC';
      break;
    case 4:
      orderBy = 'rate DESC';
      break;
  }

  let allData = [];
  if (keyword !== '') {
    let [Data] = await pool.execute('SELECT * FROM `prd_list` WHERE status = 1 AND category= ? AND prd_list.name LIKE ?', [category, `%${keyword}%`]);
    allData = Data;
  } else if (category === 1 && cateS !== 0) {
    // 查小分類
    switch (category) {
      case 1:
        {
          let [Data] = await pool.execute('SELECT prd_list.* FROM prd_list JOIN prd_type1_detail ON prd_list.id = prd_type1_detail.prd_id WHERE prd_type1_detail.cate_s = ?', [
            cateS,
          ]);
          allData = Data;
        }
        break;
      case 2:
        {
          let [Data] = await pool.execute('SELECT prd_list.* FROM prd_list JOIN prd_type2_detail ON prd_list.id = prd_type2_detail.prd_id WHERE prd_type2_detail.cate_s = ?', [
            cateS,
          ]);
          allData = Data;
        }
        break;
      case 3:
      case 4:
        {
          let [Data] = await pool.execute('SELECT prd_list.* FROM prd_list JOIN prd_type3_detail ON prd_list.id = prd_type3_detail.prd_id WHERE prd_type3_detail.cate_s = ?', [
            cateS,
          ]);
          allData = Data;
        }
        break;
    }
  } else if (cateM !== 0) {
    // 查中分類
    switch (category) {
      case 1:
        {
          let [Data] = await pool.execute('SELECT prd_list.* FROM prd_list JOIN prd_type1_detail ON prd_list.id = prd_type1_detail.prd_id WHERE prd_type1_detail.cate_m = ?', [
            cateM,
          ]);
          allData = Data;
        }
        break;
      case 2:
        {
          let [Data] = await pool.execute('SELECT prd_list.* FROM prd_list JOIN prd_type2_detail ON prd_list.id = prd_type2_detail.prd_id WHERE prd_type2_detail.cate_m = ?', [
            cateM,
          ]);
          allData = Data;
        }
        break;
      case 3:
      case 4:
        {
          let [Data] = await pool.execute('SELECT prd_list.* FROM prd_list JOIN prd_type3_detail ON prd_list.id = prd_type3_detail.prd_id WHERE prd_type3_detail.cate_m = ?', [
            cateM,
          ]);
          allData = Data;
        }
        break;
    }
  } else {
    // 查大分類
    let [Data] = await pool.execute('SELECT * FROM `prd_list` WHERE status = 1 AND category= ? ', [category]);
    allData = Data;
  }

  // 總數
  const total = allData.length;
  console.log(total);

  // 計算總頁數
  const perPage = 12; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let pageData = [];
  console.log(category);
  console.log(cateM);

  if (keyword !== '') {
    let [data] = await pool.execute(`SELECT * FROM prd_list WHERE status = 1 AND category= ? AND prd_list.name LIKE ?  ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [
      category,
      `%${keyword}%`,
      perPage,
      offset,
    ]);

    for (let i = 0; i < data.length; i++) {
      let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
      let isPrdLike = false;
      if (likeData.length > 0) {
        isPrdLike = true;
      }
      data[i].rate = data[i].rate.toFixed(1);
      data[i] = { ...data[i], isPrdLike };
    }

    pageData = data;
  } else if (category === 1 && cateS !== 0) {
    // 查小分類
    switch (category) {
      case 1:
        {
          let [data] = await pool.execute(
            `SELECT prd_list.* FROM prd_list JOIN prd_type1_detail ON prd_list.id = prd_type1_detail.prd_id WHERE prd_type1_detail.cate_s = ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
            [cateS, perPage, offset]
          );

          for (let i = 0; i < data.length; i++) {
            let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
            let isPrdLike = false;
            if (likeData.length > 0) {
              isPrdLike = true;
            }
            data[i].rate = data[i].rate.toFixed(1);
            data[i] = { ...data[i], isPrdLike };
          }

          pageData = data;
        }
        break;
      case 2:
        {
          let [data] = await pool.execute(
            `SELECT prd_list.* FROM prd_list JOIN prd_type2_detail ON prd_list.id = prd_type2_detail.prd_id WHERE prd_type2_detail.cate_s = ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
            [cateS, perPage, offset]
          );
          for (let i = 0; i < data.length; i++) {
            let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
            let isPrdLike = false;
            if (likeData.length > 0) {
              isPrdLike = true;
            }
            data[i].rate = data[i].rate.toFixed(1);
            data[i] = { ...data[i], isPrdLike };
          }
          pageData = data;
        }
        break;
      case 3:
      case 4:
        {
          let [data] = await pool.execute(
            `SELECT prd_list.* FROM prd_list JOIN prd_type3_detail ON prd_list.id = prd_type3_detail.prd_id WHERE prd_type3_detail.cate_s = ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
            [cateS, perPage, offset]
          );
          for (let i = 0; i < data.length; i++) {
            let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
            let isPrdLike = false;
            if (likeData.length > 0) {
              isPrdLike = true;
            }
            data[i].rate = data[i].rate.toFixed(1);
            data[i] = { ...data[i], isPrdLike };
          }
          pageData = data;
        }
        break;
    }
  } else if (cateM !== 0) {
    // 查中分類
    switch (category) {
      case 1:
        {
          let [data] = await pool.execute(
            `SELECT prd_list.* FROM prd_list JOIN prd_type1_detail ON prd_list.id = prd_type1_detail.prd_id WHERE prd_type1_detail.cate_m = ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
            [cateM, perPage, offset]
          );
          for (let i = 0; i < data.length; i++) {
            let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
            let isPrdLike = false;
            if (likeData.length > 0) {
              isPrdLike = true;
            }
            data[i].rate = data[i].rate.toFixed(1);
            data[i] = { ...data[i], isPrdLike };
          }
          pageData = data;
        }
        break;
      case 2:
        {
          let [data] = await pool.execute(
            `SELECT prd_list.* FROM prd_list JOIN prd_type2_detail ON prd_list.id = prd_type2_detail.prd_id WHERE prd_type2_detail.cate_m = ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
            [cateM, perPage, offset]
          );
          for (let i = 0; i < data.length; i++) {
            let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
            let isPrdLike = false;
            if (likeData.length > 0) {
              isPrdLike = true;
            }
            data[i].rate = data[i].rate.toFixed(1);
            data[i] = { ...data[i], isPrdLike };
          }
          pageData = data;
        }
        break;
      case 3:
      case 4:
        {
          let [data] = await pool.execute(
            `SELECT prd_list.* FROM prd_list JOIN prd_type3_detail ON prd_list.id = prd_type3_detail.prd_id WHERE prd_type3_detail.cate_m = ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
            [cateM, perPage, offset]
          );
          for (let i = 0; i < data.length; i++) {
            let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
            let isPrdLike = false;
            if (likeData.length > 0) {
              isPrdLike = true;
            }
            data[i].rate = data[i].rate.toFixed(1);
            data[i] = { ...data[i], isPrdLike };
          }
          pageData = data;
        }
        break;
    }
  } else {
    // 查大分類
    let [data] = await pool.execute(`SELECT * FROM prd_list WHERE status = 1 AND category= ?  ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [category, perPage, offset]);
    for (let i = 0; i < data.length; i++) {
      let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
      let isPrdLike = false;
      if (likeData.length > 0) {
        isPrdLike = true;
      }
      data[i].rate = data[i].rate.toFixed(1);
      data[i] = { ...data[i], isPrdLike };
    }
    pageData = data;
  }

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});

// 後台商品列表
router.get(`/be/prdlist`, async (req, res) => {
  let page = req.query.page || 1;

  let [prdListData] = await pool.execute(
    'SELECT prd_list.id, prd_list.prd_num AS prdnum, prd_list.name, prd_list.price, prd_list.status, prd_status_cate.name FROM prd_list JOIN prd_status_cate ON prd_list.status = prd_status_cate.id WHERE prd_list.status != 0'
  );

  const total = prdListData.length;
  // 計算總頁數
  const perPage = 8; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  let [prdListPageData] = await pool.execute(
    'SELECT prd_list.id, prd_list.prd_num AS prdnum, prd_list.name, prd_list.main_img, prd_list.price, prd_list.status, prd_status_cate.name as statusName FROM prd_list JOIN prd_status_cate ON prd_list.status = prd_status_cate.id WHERE prd_list.status != 0 ORDER BY prd_list.id DESC LIMIT ? OFFSET ?',
    [perPage, offset]
  );

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: prdListPageData,
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
  let thirdPrdSel = [[], [], [], [], [], [], [], []];
  // console.log(majorPrdSelData);
  majorPrdSel = majorPrdSelData.map((v, i) => {
    // console.log(v);
    return v.name;
  });
  // console.log(subPrdSelData);
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
  thirdPrdSelData.map((v) => {
    switch (v.parent_id) {
      case 1:
        thirdPrdSel[0].push(v.name);
        break;
    }
  });

  res.json({ majorPrdSel, subPrdSel });
});

// 商品細節
router.get('/detail/:prdId', async (req, res, next) => {
  // 商品細項用到的名稱
  let userId = req.query.userId || -1;
  let prdId = req.params.prdId;
  let [cateL] = await pool.execute(`SELECT category FROM prd_list WHERE prd_list.id = ?`, [req.params.prdId]);
  // console.log('cateL:', cateL[0].category);
  cateL = cateL[0].category;
  let detailData = [];
  switch (cateL) {
    case 1:
      let [type1List] = await pool.execute(
        'SELECT prd_list.id, prd_list.name, prd_list.price, prd_list.main_img, prd_list.disc, prd_type1_detail.cate_m, prd_type1_detail.cate_s, prd_list.rate, prd_type1_detail.abv, prd_type1_detail.brand,prd_type1_detail.capacity, prd_origin.name AS originName FROM prd_list JOIN prd_type1_detail on prd_list.id = prd_type1_detail.prd_id JOIN prd_origin ON prd_type1_detail.origin = prd_origin.id WHERE prd_list.id = ?',
        [prdId]
      );
      detailData.push(type1List[0]);
      break;
    case 2:
      {
        let [type2List] = await pool.execute(
          'SELECT prd_list.id, prd_list.name, prd_list.price, prd_list.main_img, prd_list.disc, prd_type2_detail.cate_m, prd_list.rate, prd_type2_detail.brand,prd_type2_detail.capacity, prd_origin.name AS originName FROM prd_list JOIN prd_type2_detail on prd_list.id = prd_type2_detail.prd_id JOIN prd_origin ON prd_type2_detail.origin = prd_origin.id WHERE prd_list.id = ?',
          [prdId]
        );
        detailData.push(type2List[0]);
      }
      break;
    case 3:
    case 4:
      {
        let [type3List] = await pool.execute(
          'SELECT prd_list.id, prd_list.name, prd_list.price, prd_list.main_img, prd_list.disc, prd_type3_detail.cate_m, prd_list.rate, prd_type3_detail.capacity, prd_material_cate.name AS materName, prd_origin.name AS originName FROM prd_list JOIN prd_type3_detail on prd_list.id = prd_type3_detail.prd_id JOIN prd_origin ON prd_type3_detail.origin = prd_origin.id JOIN prd_material_cate ON prd_material_cate.id =prd_type3_detail.mater WHERE prd_list.id = ?',
          [prdId]
        );
        detailData.push(type3List[0]);
      }
      break;
  }

  // console.log(detailData);
  // console.log(detailData[0].cate_m);
  // console.log(detailData[0].cate_s);

  // 中分類的 prd_detail_cate 的 Name (cate_m)
  let [cateMNameData] = await pool.execute('SELECT name FROM prd_detail_cate WHERE id = ?', [detailData[0].cate_m]);
  let cateMName = cateMNameData[0].name;

  // 是否加入最愛
  let [isLikeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id= ? AND prd_id = ?`, [userId, prdId]);
  let isLike = false;
  if (isLikeData.length > 0) {
    isLike = true;
  }
  detailData[0] = { ...detailData[0], cateMName, isLike };

  if (cateL === 1) {
    // 小分類的 prd_detail_cate 的 Name (cate_s)
    let [cateSNameData] = await pool.execute('SELECT name FROM prd_detail_cate WHERE id = ?', [detailData[0].cate_s]);
    let cateSName = cateSNameData[0].name;
    detailData[0] = { ...detailData[0], cateMName, cateSName };
  }

  let [detailImgData] = await pool.execute('SELECT url  FROM `prd_img` WHERE prd_id = ?', [req.params.prdId]);
  // console.log(detailImgData);

  // detailImgData.unshift(url: detailData[0].main_img);
  detailData[0].rate = detailData[0].rate.toFixed(1);

  let detailImgList = [detailData[0].main_img];
  for (i = 0; i < detailImgData.length; i++) {
    detailImgList.push(detailImgData[i].url);
  }

  res.json({ cateL: cateL, detailData: [detailData[0]], detailImgList });
});

// 熱門商品
router.get('/hot', async (req, res) => {
  let [data] = await pool.execute('SELECT id, name, main_img FROM `prd_list` ORDER BY `prd_list`.`sale_quantity` DESC LIMIT 10');

  res.json({ data });
});

// 類別
router.get('/cateL', async (req, res) => {
  let [cateL] = await pool.execute('SELECT id, name FROM `prd_detail_cate` WHERE level = 1');
  res.json({ data: cateL });
});
router.get('/cateM', async (req, res) => {
  let [cateM] = await pool.execute('SELECT id, name FROM `prd_detail_cate` WHERE level = 2 AND parent_id = ?', [req.query.cateL]);
  res.json({ data: cateM });
});
router.get('/cateS', async (req, res) => {
  let [cateS] = await pool.execute('SELECT id, name FROM `prd_detail_cate` WHERE level = 3 AND parent_id = ?', [req.query.cateM]);
  res.json({ data: cateS });
});

// 材質
router.get('/material', async (req, res) => {
  let [material] = await pool.execute('SELECT * FROM `prd_material_cate`');
  res.json({ data: material });
});

// 相關商品
router.get(`/related/:prdId`, async (req, res) => {
  let cateM = req.query.cateM;
  // let cateM = req.query.cateM;
  let prdId = req.params.prdId;
  let userId = req.query.userId || -1;
  // console.log(prdId);
  try {
    let data = [];
    // console.log(cateM);
    // console.log(cateM.length);
    for (let i = 0; i < cateM.length; i++) {
      // console.log(cateM[i]);
      let [type1res] = await pool.execute(
        `SELECT prd_list.id, prd_list.name, prd_list.price, prd_list.rate, prd_list.main_img FROM prd_list JOIN prd_type1_detail ON  prd_list.id = prd_type1_detail.prd_id  WHERE cate_m = ? AND prd_list.status = 1`,
        [Number(cateM[i])]
      );
      let [type2res] = await pool.execute(
        `SELECT prd_list.id, prd_list.name, prd_list.price, prd_list.rate, prd_list.main_img FROM prd_list JOIN prd_type2_detail ON  prd_list.id = prd_type2_detail.prd_id  WHERE cate_m = ? AND prd_list.status = 1`,
        [Number(cateM[i])]
      );
      let [type3res] = await pool.execute(
        `SELECT prd_list.id, prd_list.name, prd_list.price, prd_list.rate , prd_list.main_img FROM prd_list JOIN prd_type3_detail ON  prd_list.id = prd_type3_detail.prd_id  WHERE cate_m = ? AND prd_list.status = 1`,
        [Number(cateM[i])]
      );

      type1res.map((item) => {
        Number(prdId) !== item.id && data.push(item);
      });
      type2res.map((item) => {
        Number(prdId) !== item.id && data.push(item);
      });
      type3res.map((item) => {
        Number(prdId) !== item.id && data.push(item);
      });
    }

    for (let i = 0; i < data.length; i++) {
      let [likeData] = await pool.execute(`SELECT * FROM user_like WHERE user_id = ? AND prd_id =?`, [userId, data[i].id]);
      let isPrdLike = false;
      if (likeData.length > 0) {
        isPrdLike = true;
      }
      data[i] = { ...data[i], isPrdLike };
    }

    res.json({ data: data });
  } catch (e) {
    console.error(e);
  }
});

// 新增商品
router.post('/', async (req, res) => {
  multi_upload(req, res, async function (err) {
    // console.log(req.body);
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

          let [type3Result] = await pool.execute('INSERT INTO prd_type3_detail (prd_id, origin, capacity, mater, cate_m) VALUES (?, ?, ?, ?, ?)', [
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
