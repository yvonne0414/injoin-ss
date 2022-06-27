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
  // console.log('insert result:', result);
  let [participant] = await pool.execute('INSERT INTO `group_participant` (group_id, user_id, audit_status) VALUES (?, ?, ?)', [
    result.insertId,
    req.body.userId,
    req.body.auditStatus,
  ]);

  // response
  res.json({ code: 0, result: 'OK' });
});

// 官方、私人 揪團列表（1:官方, 2:私人）
router.get('/list', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;
  let groupCate = req.query.groupCate;
  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.is_official =?`,
    [groupCate]
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
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName, group_status.status_name FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code JOIN group_status ON group_list.status = group_status.id WHERE group_list.is_official =? ORDER BY start_time DESC LIMIT ? OFFSET ?',
    [groupCate, perPage, offset]
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

// 詳細
router.get('/groupdetail/:groupId', async (req, res, next) => {
  let [groupDetailData, fields] = await pool.execute(
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName, group_status.status_name FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code JOIN group_status ON group_list.status = group_status.id WHERE group_list.id = ?',
    [req.params.groupId]
  );
  // console.log(groupDetailData);

  res.json({
    data: groupDetailData,
  });
});

// 我揪的團列表
router.get('/ownaddgroup', async (req, res, next) => {
  // console.log(req);
  // 當前頁面
  let page = req.query.page || 1;
  let userId = req.query.userId;
  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.user_id = ? AND group_list.status < 3`,
    [userId]
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
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName, group_status.status_name FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code JOIN group_status ON group_list.status = group_status.id  WHERE group_list.user_id = ? AND group_list.status < 3 ORDER BY start_time DESC LIMIT ? OFFSET ?',
    [userId, perPage, offset]
  );
  // console.log(pageData);

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});

// 參加揪團
// groupCate:（官方：1, 私人：2）
// groupStatus: (待參加：(3,0), 歷史紀錄:(4,2))
router.get('/participant', async (req, res, next) => {
  // console.log(req);
  // 當前頁面
  let page = req.query.page || 1;
  let userId = req.query.userId;
  let groupMaxStatus = req.query.groupMaxStatus;
  let groupMinStatus = req.query.groupMinStatus;
  let groupCate = req.query.groupCate;
  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT group_participant.* ,group_list.*, group_status.status_name, tw_county.name AS cityName, user_list.name AS user_name FROM group_participant JOIN group_list ON group_participant.group_id=group_list.id JOIN group_status ON group_list.status=group_status.id JOIN tw_county ON group_list.place_conuntry=tw_county.code JOIN user_list ON group_participant.user_id=user_list.id WHERE group_participant.user_id= ? AND group_list.status < ? AND group_list.status > ? AND group_list.is_official = ?`,
    [userId, groupMaxStatus, groupMinStatus, groupCate]
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
    'SELECT group_participant.* ,group_list.*, group_status.status_name, tw_county.name AS cityName, user_list.name AS user_name FROM group_participant JOIN group_list ON group_participant.group_id=group_list.id JOIN group_status ON group_list.status=group_status.id JOIN tw_county ON group_list.place_conuntry=tw_county.code JOIN user_list ON group_participant.user_id=user_list.id WHERE group_participant.user_id= ? AND group_list.status < ? AND group_list.status > ? AND group_list.is_official = ? ORDER BY start_time DESC LIMIT ? OFFSET ?',
    [userId, groupMaxStatus, groupMinStatus, groupCate, perPage, offset]
  );
  // console.log(pageData);

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});

// 編輯活動
router.post('/update/:groupId', uploader.single('groupImg'), async (req, res) => {
  let groupImg = req.file ? '/groupupload/' + req.file.filename : '';
  let groupStartTime = new Date(req.body.groupStartDate);
  let groupEndTime = new Date(req.body.groupEndDate);

  let [result] = await pool.execute(
    'UPDATE `group_list` SET name = ?, disc = ?, max_num = ?, audit_time = ?, vip_level = ?, img = ?, price = ?, start_time = ?, end_time = ?, place_conuntry = ?, place_detail = ?  WHERE id = ?',
    [
      req.body.groupName,
      req.body.groupDisc,
      req.body.groupPeopleNum,
      req.body.groupDeadLine,
      req.body.vipLevel,
      groupImg,
      req.body.groupFee,
      groupStartTime,
      groupEndTime,
      req.body.groupAddressCounty,
      req.body.groupAddressDetail,
      req.params.groupId,
    ]
  );

  // response
  res.json({ code: 0, result: 'OK' });
});
// 刪除活動
router.post('/delete/:groupId', async (req, res) => {
  let [result] = await pool.execute('UPDATE `group_list` SET status = 4  WHERE id = ?', [req.params.groupId]);

  // response
  res.json({ code: 0, result: 'OK' });
});
// 報名活動
router.post('/join/:groupId', async (req, res) => {
  let userId = req.query.userId;
  let [result] = await pool.execute('INSERT INTO `group_participant` (group_id, user_id, audit_status) VALUES (?, ?, ?)', [req.params.groupId, userId, 0]);

  // response
  res.json({ code: 0, result: 'OK' });
});
// 取消報名活動
router.post('/unjoin/:groupId', async (req, res) => {
  let userId = req.query.userId;
  let [result] = await pool.execute('DELETE FROM group_participant WHERE group_id = ? AND user_id = ?', [req.params.groupId, userId]);

  // response
  res.json({ code: 0, result: 'OK' });
});
// TODO: 審核成員
router.post('/checkmember/:groupId', async (req, res) => {
  let userId = req.query.userId;
  let [result] = await pool.execute('UPDATE group_participant SET audit_status = 1 WHERE group_id = ? AND user_id = ?', [req.params.groupId, userId]);

  // response
  res.json({ code: 0, result: 'OK' });
});
// TODO: 聊天室

module.exports = router;
