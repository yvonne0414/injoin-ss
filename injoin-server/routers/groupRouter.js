const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置
const storage = multer.diskStorage({
  // 設定儲存的目的地 （檔案夾）
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'groupUpload'));
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
    console.log(file);
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
    fileSize: 500 * 1024,
  },
});

// 新增揪團
router.post('/post', uploader.single('groupImg'), async (req, res, next) => {
  // console.log('register body:', req.body);
  // console.log('req.file', req.file);

  let groupImg = req.file ? '/groupupload/' + req.file.filename : '';
  let groupStartTime = new Date(req.body.groupStartDate);
  let groupEndTime = new Date(req.body.groupEndDate);

  // save to db
  let [result] = await pool.execute(
    'INSERT INTO `group_list` (name, disc, user_id, max_num, now_num, is_official, status, audit_time, vip_level, img, price, start_time, end_time, place_conuntry, place_detail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      req.body.groupName,
      req.body.groupDisc,
      req.body.userId,
      req.body.groupPeopleNum,
      1,
      req.body.groupIsOfficial,
      1,
      req.body.groupDeadLine,
      req.body.vipLevel,
      groupImg,
      req.body.groupFee,
      groupStartTime,
      groupEndTime,
      req.body.groupAddressCounty,
      req.body.groupAddressDetail,
    ]
  );
  console.log('insert result:', result);
  let [participant] = await pool.execute('INSERT INTO `group_participant` (group_id, user_id, audit_status) VALUES (?, ?, ?)', [
    result.insertId,
    req.body.userId,
    req.body.auditStatus,
  ]);

  // response
  res.json({ code: 0, result: 'OK' });
});

// 官方
router.get('/official', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;
  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.is_official =1`
  );
  // 總數
  const total = allData.length;

  // 計算總頁數
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let [pageData] = await pool.execute(
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.is_official =1 ORDER BY start_time DESC LIMIT ? OFFSET ?',
    [perPage, offset]
  );

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});
// 私人
router.get('/private', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;
  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.is_official =2`
  );
  // 總數
  const total = allData.length;

  // 計算總頁數
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let [pageData] = await pool.execute(
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.is_official =2 ORDER BY start_time DESC LIMIT ? OFFSET ?',
    [perPage, offset]
  );

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});
// TODO:詳細

module.exports = router;
