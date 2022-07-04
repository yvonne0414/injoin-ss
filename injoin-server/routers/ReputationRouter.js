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
    cb(null, path.join(__dirname, '..', 'public', 'review'));
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
}).array('reviewImg[]', 3);

// 取得user 待評價訂單列表
router.get('/notreview', async (req, res) => {
  let page = req.query.page || 1;

  // 訂單狀態為完成 且 顯示未評價
  let [orderAllData] = await pool.execute(
    'SELECT order_list.id, order_list.user_id, order_list.is_review, order_list.order_time FROM order_list WHERE order_list.logistics_state = 3 AND order_list.is_review = 0 AND user_id = ?',
    [req.query.userId]
  );

  // 總數
  const total = orderAllData.length;

  // 計算總頁數
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  let [orderData] = await pool.execute(
    'SELECT order_list.id, order_list.user_id, order_list.is_review, order_list.order_time FROM order_list WHERE order_list.logistics_state = 3 AND order_list.is_review = 0 AND user_id = ? ORDER BY order_list.order_time DESC LIMIT ? OFFSET ?',
    [req.query.userId, perPage, offset]
  );

  let toRateData = [];
  for (i = 0; i < orderData.length; i++) {
    // 訂單細項
    let [orderDetailData] = await pool.execute(
      `SELECT order_detail.id AS orderDetailId, order_detail.prd_id, order_detail.is_review, prd_list.name, prd_list.main_img  FROM order_detail JOIN prd_list ON order_detail.prd_id = prd_list.id  WHERE order_id = ?`,
      [orderData[i].id]
    );
    toRateData.push({ ...orderData[i], orderDetailData });
  }

  // res
  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: toRateData,
  });
});

// 取得user 歷史商品評價列表
router.get('/history', async (req, res) => {
  let page = req.query.page || 1;
  let [allReview] = await pool.execute('SELECT prd_review.*, prd_list.name FROM prd_review JOIN prd_list on prd_review.prd_id=prd_list.id WHERE prd_review.user_id = ?', [
    req.query.userId,
  ]);
  console.log(allReview);
  // 總數
  const total = allReview.length;

  // 計算總頁數
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  let [review] = await pool.execute(
    'SELECT prd_review.*, prd_list.name FROM prd_review JOIN prd_list on prd_review.prd_id=prd_list.id WHERE prd_review.user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
    [req.query.userId, perPage, offset]
  );

  let data = [];

  for (i = 0; i < review.length; i++) {
    let [reviewImg] = await pool.execute('SELECT * FROM prd_review_img WHERE review_id = ?', [review[i].id]);
    let imgList = [];
    reviewImg.map((img) => {
      imgList.push(img.img);
    });
    data.push({ ...review[i], imgList });
  }

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data,
  });
});

// 取得商品評價列表
router.get('/:prdId', async (req, res) => {
  let [prdReview] = await pool.execute(
    'SELECT prd_review.id, prd_review.user_id, user_list.name, user_list.user_img, prd_review.rating, prd_review.content, order_list.order_time FROM prd_review JOIN user_list on prd_review.user_id = user_list.id JOIN order_list on prd_review.order_id = order_list.id WHERE prd_id = ?',
    [req.params.prdId]
  );

  let data = [];
  for (i = 0; i < prdReview.length; i++) {
    let [reviewImg] = await pool.execute('SELECT img FROM prd_review_img WHERE review_id = ?', [prdReview[i].id]);
    let reviewImgList = [];
    for (j = 0; j < reviewImg.length; j++) {
      reviewImgList.push(reviewImg[j].img);
    }
    // console.log(prdReview);

    data.push({ ...prdReview[i], reviewImgList });
  }

  res.json({ data });
});

// 新增評價
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
    console.log(req.files);

    // save to db
    let [result] = await pool.execute('INSERT INTO prd_review (user_id, prd_id, order_id, content, rating) VALUES (?, ?, ?, ?, ?)', [
      req.body.userId,
      req.body.prdId,
      req.body.orderId,
      req.body.content,
      req.body.rating,
    ]);
    // console.log(result.insertId);

    // img save to db
    if (req.files.length) {
      for (i = 0; i < req.files.length; i++) {
        let image = '/review/' + req.files[i].filename;
        let [imgResult] = await pool.execute('INSERT INTO prd_review_img (review_id, img) VALUES (?, ?)', [result.insertId, image]);
      }
    }

    // set isreview
    // detail
    let [isReview] = await pool.execute('UPDATE order_detail SET is_review = 1 WHERE id = ?', [req.body.orderDetailId]);

    // 看是否還有未評論的
    let [isReviewList] = await pool.execute('SELECT * FROM order_detail WHERE order_id = ? AND is_review = 0', [req.body.orderId]);

    if (isReviewList.length === 0) {
      // 訂單都評論完 訂單變為已完成
      let [isReviewList] = await pool.execute('UPDATE order_list SET is_review = 1 WHERE id = ?', [req.body.orderId]);
    }

    // 更新商品評價
    let [prdRate] = await pool.execute('SELECT * FROM prd_review WHERE prd_id = ?', [req.body.prdId]);
    let oldRate = 0;
    for (i = 0; i < prdRate.length; i++) {
      oldRate += prdRate[i].rating;
    }
    let newRate = oldRate / prdRate.length;
    let [updPrdRate] = await pool.execute('UPDATE prd_list SET rate = ? WHERE id = ?', [newRate, req.body.prdId]);

    // console.log(req.files);
    // console.log(req.body);
    res.status(200).json({ code: 0, result: 'ok' });
  });
});

module.exports = router;
