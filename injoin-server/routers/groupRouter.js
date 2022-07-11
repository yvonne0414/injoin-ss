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

// 後台揪團列表
router.get('/be/list', async (req, res) => {
  let [data] = await pool.execute(
    `SELECT group_list.id, group_list.name, group_list.img, group_list.is_official, group_list.status, group_status.status_name FROM group_list JOIN group_status ON group_list.status = group_status.id`
  );
  let page = req.query.page || 1;
  const total = data.length;
  // 計算總頁數
  const perPage = 8; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  let [groupListPageData] = await pool.execute(
    'SELECT group_list.id, group_list.name, group_list.img, group_list.is_official, group_list.status, group_status.status_name FROM group_list JOIN group_status ON group_list.status = group_status.id ORDER BY id DESC LIMIT ? OFFSET ?',
    [perPage, offset]
  );

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: groupListPageData,
  });
});

// 官方、私人 揪團列表（1:官方, 2:私人）
router.get('/list', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;
  let groupCate = req.query.groupCate;
  let now = new Date().toLocaleDateString();

  // 更新活動狀態 1:報名 2:進行中 3:已額滿（審核時更新） 4:已結束
  // 人數額滿時：更新成員審核狀態
  let [updGroupStatusAudit] = await pool.execute('UPDATE `group_list` SET `status`=3 WHERE max_num = now_num AND start_time > ?', [now]);

  // 活動開始 -> 進行中， 活動結束 ->已結束
  let [updGroupStatusStart] = await pool.execute('UPDATE `group_list` SET `status`=2 WHERE start_time < ? AND end_time > ?', [now, now]);
  let [updGroupStatusEnd] = await pool.execute('UPDATE `group_list` SET `status`=4 WHERE  start_time < ? AND end_time < ?', [now, now]);

  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.is_official =? AND group_list.status < 4 AND group_list.status > 0`,
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
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName, group_status.status_name FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code JOIN group_status ON group_list.status = group_status.id WHERE group_list.is_official =? AND group_list.status < 4 AND group_list.status > 0 ORDER BY start_time DESC LIMIT ? OFFSET ?',
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
  let userId = req.query.userId;
  let isJoin = false;

  // 驗證是否報名過
  let [participant] = await pool.execute('SELECT * FROM group_participant WHERE group_id = ?', [req.params.groupId]);
  // console.log(participant);
  for (let i = 0; i < participant.length; i++) {
    if (Number(participant[i].user_id) === Number(userId)) {
      isJoin = true;
    }
  }

  // 取得詳細資料
  let [groupDetailData, fields] = await pool.execute(
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName, group_status.status_name FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code JOIN group_status ON group_list.status = group_status.id WHERE group_list.id = ?',
    [req.params.groupId]
  );
  // console.log(groupDetailData);

  res.json({
    isJoin,
    data: groupDetailData,
  });
});

// 我揪的團列表
router.get('/ownaddgroup', async (req, res, next) => {
  // console.log(req);
  let nowDate = new Date();
  // 當前頁面
  let page = req.query.page || 1;
  let userId = req.query.userId;
  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT group_list.*, user_list.name as username, tw_county.name as cityName FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code WHERE group_list.user_id = ? AND group_list.status < 3 AND group_list.end_time > ?`,
    [userId, nowDate]
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
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName, group_status.status_name FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code JOIN group_status ON group_list.status = group_status.id  WHERE group_list.user_id = ? AND group_list.status < 3 AND group_list.end_time > ? ORDER BY start_time DESC LIMIT ? OFFSET ?',
    [userId, nowDate, perPage, offset]
  );
  // console.log(pageData);
  // 取得各個活動參加人員
  let newPageData = [];
  for (i = 0; i < pageData.length; i++) {
    let [member] = await pool.execute(
      'SELECT group_participant.*, user_list.name, user_list.user_img FROM group_participant JOIN user_list ON group_participant.user_id = user_list.id WHERE group_participant.group_id = ?',
      [pageData[i].id]
    );
    // console.log(member);
    newPageData.push({ ...pageData[i], member: member });
  }
  // console.log(newPageData);

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: newPageData,
  });
});

// 參加揪團
// groupCate:（官方：1, 私人：2）
// groupStatus: (待參加：(4,0), 歷史紀錄:(5,3))
router.get('/participant', async (req, res, next) => {
  // console.log(req);
  // 當前頁面
  let page = req.query.page || 1;
  let userId = req.query.userId || -1;
  let groupMaxStatus = req.query.groupMaxStatus;
  let groupMinStatus = req.query.groupMinStatus;
  let groupCate = req.query.groupCate;
  let now = new Date().toLocaleDateString();

  // 更新活動狀態 1:報名 2:進行中 3:已額滿（審核時更新） 4:已結束

  // 人數額滿時：更新成員審核狀態
  let [updGroupStatusAudit] = await pool.execute('UPDATE `group_list` SET `status`=3 WHERE max_num = now_num AND start_time > ?', [now]);

  // 活動開始 -> 進行中， 活動結束 ->已結束
  let [updGroupStatusStart] = await pool.execute('UPDATE `group_list` SET `status`=2 WHERE start_time < ? AND end_time > ?', [now, now]);
  let [updGroupStatusEnd] = await pool.execute('UPDATE `group_list` SET `status`=4 WHERE  start_time < ? AND end_time < ?', [now, now]);

  // 抓資料
  let allData;
  if (groupMaxStatus !== 4) {
    [allData, fields] = await pool.execute(
      `SELECT group_participant.* ,group_list.*, group_status.status_name, tw_county.name AS cityName, user_list.name AS user_name FROM group_participant JOIN group_list ON group_participant.group_id=group_list.id JOIN group_status ON group_list.status=group_status.id JOIN tw_county ON group_list.place_conuntry=tw_county.code JOIN user_list ON group_participant.user_id=user_list.id WHERE group_participant.user_id= ? AND group_list.status < ? AND group_list.status > ? AND group_list.is_official = ?`,
      [userId, groupMaxStatus, groupMinStatus, groupCate]
    );
  } else {
    [allData, fields] = await pool.execute(
      `SELECT group_participant.* ,group_list.*, group_status.status_name, tw_county.name AS cityName, user_list.name AS user_name FROM group_participant JOIN group_list ON group_participant.group_id=group_list.id JOIN group_status ON group_list.status=group_status.id JOIN tw_county ON group_list.place_conuntry=tw_county.code JOIN user_list ON group_participant.user_id=user_list.id WHERE group_participant.user_id= ? AND group_list.status < ? AND group_list.status > ? AND group_list.is_official = ? AND group_list.end_time < ?`,
      [userId, groupMaxStatus, groupMinStatus, groupCate]
    );
  }
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

// 編輯頁詳細
router.get('/editgroupdetail/:groupId', async (req, res, next) => {
  let userId = req.query.userId;
  // 判斷是否為團主（修改權限）
  let [groupUserId] = await pool.execute(`SELECT user_id FROM group_list WHERE id=?;`, [req.params.groupId]);
  if (Number(groupUserId[0].user_id) !== Number(userId)) {
    res.json({ code: 10, result: '您沒有編輯權限' });
    return;
  }

  // 取得詳細資料
  let [groupDetailData, fields] = await pool.execute(
    'SELECT group_list.*, user_list.name as username, tw_county.name as cityName, tw_county.code as cityCode, group_status.status_name FROM group_list JOIN user_list ON group_list.user_id = user_list.id JOIN tw_county on group_list.place_conuntry = tw_county.code JOIN group_status ON group_list.status = group_status.id WHERE group_list.id = ?',
    [req.params.groupId]
  );
  // console.log(groupDetailData);

  res.json({
    code: 0,
    data: groupDetailData,
  });
});

// 編輯活動
router.post('/update/:groupId', uploader.single('groupImg'), async (req, res) => {
  // 依有無上傳照片決定sql
  let haveImg = Boolean(req.file);
  // console.log(haveImg);
  // 沒更新圖片時
  if (!haveImg) {
    let [result] = await pool.execute('UPDATE `group_list` SET name = ?, disc = ?, max_num = ?,  vip_level = ?, price = ?, place_conuntry = ?, place_detail = ?  WHERE id = ?', [
      req.body.groupName,
      req.body.groupDisc,
      req.body.groupPeopleNum,
      req.body.vipLevel,
      req.body.groupFee,
      req.body.groupAddressCounty,
      req.body.groupAddressDetail,
      req.params.groupId,
    ]);
  } else {
    let groupImg = req.file ? '/groupupload/' + req.file.filename : '';
    let [result] = await pool.execute(
      'UPDATE `group_list` SET name = ?, disc = ?, max_num = ?,  vip_level = ?, img = ?, price = ?, place_conuntry = ?, place_detail = ?  WHERE id = ?',
      [
        req.body.groupName,
        req.body.groupDisc,
        req.body.groupPeopleNum,
        req.body.vipLevel,
        groupImg,
        req.body.groupFee,
        req.body.groupAddressCounty,
        req.body.groupAddressDetail,
        req.params.groupId,
      ]
    );
  }

  // response
  res.json({ code: 0, result: 'OK' });
});

// 刪除活動（軟刪除）
router.post('/delete/:groupId', async (req, res) => {
  let [result] = await pool.execute('UPDATE `group_list` SET status = 4  WHERE id = ?', [req.params.groupId]);

  // response
  res.json({ code: 0, result: 'OK' });
});

// 報名活動
router.post('/join/:groupId', async (req, res) => {
  let userId = req.body.userId;

  // 確定未報名過
  let isJoin = false;
  let [participant] = await pool.execute('SELECT * FROM group_participant WHERE group_id = ?', [req.params.groupId]);
  for (let i = 0; i < participant.length; i++) {
    if (Number(participant[i].user_id) === Number(userId)) {
      isJoin = true;
    }
  }
  // 報名過回傳已報名
  if (isJoin) {
    res.json({ code: 10, result: '您已報名過' });
    return;
  }

  // savetodb
  let [result] = await pool.execute('INSERT INTO `group_participant` (group_id, user_id, audit_status) VALUES (?, ?, ?)', [req.params.groupId, userId, 0]);

  // response
  res.json({ code: 0, result: 'OK' });
});

// 取消報名活動
router.post('/unjoin/:groupId', async (req, res) => {
  // console.log(req.body);
  // console.log(req.query);
  // console.log(req.params);

  let userId = req.body.userId;

  // 刪除參加者欄位
  let [result] = await pool.execute('DELETE FROM group_participant WHERE group_id = ? AND user_id = ?', [req.params.groupId, userId]);

  // 更新現在參加人數
  // 先抓參與人數
  let [member] = await pool.execute('SELECT * FROM group_participant WHERE group_id = ? AND audit_status = 1', [req.params.groupId]);
  // 更新參與人數
  let [addmembernum] = await pool.execute('UPDATE group_list SET now_num = ? WHERE id = ?', [member.length, req.params.groupId]);

  // response
  res.json({ code: 0, result: 'OK' });
});

// 取得活動成員
router.get('/memberlist/:groupId', async (req, res) => {
  let userId = req.query.userId;
  let [member] = await pool.execute(
    'SELECT group_participant.*, user_list.name, user_list.user_img FROM group_participant JOIN user_list ON group_participant.user_id = user_list.id WHERE group_participant.group_id = ?',
    [req.params.groupId]
  );

  // response
  res.json({ data: member });
});

// 審核成員
router.post('/checkmember/:groupId', async (req, res) => {
  let memberId = req.body.memberId;
  let now = new Date().toLocaleDateString();
  // 先確認人數未達上限
  let [nowmember] = await pool.execute('SELECT max_num, now_num FROM group_list WHERE id= ?', [req.params.groupId]);
  if (nowmember[0].max_num === nowmember[0].now_num) {
    res.json({ code: 10, result: '人數已達上限' });
    return;
  }

  // 更新審核狀態
  let [result] = await pool.execute('UPDATE group_participant SET audit_status = 1 WHERE group_id = ? AND user_id = ?', [req.params.groupId, memberId]);

  // 增加人數
  // 先抓參與人數
  let [member] = await pool.execute('SELECT * FROM group_participant WHERE group_id = ? AND audit_status = 1', [req.params.groupId]);
  // 更新參與人數
  let [addmembernum] = await pool.execute('UPDATE group_list SET now_num = ? WHERE id = ?', [member.length, req.params.groupId]);

  // TODO: 當人數與最高人數相同則變為人數: 已額滿
  if (Number(nowmember[0].max_num) === Number(member.length)) {
    // 更新活動狀態 1:報名 2:進行中 3:已額滿（審核時更新） 4:已結束
    // 人數額滿時：更新成員審核狀態
    let [updGroupStatusAudit] = await pool.execute('UPDATE `group_list` SET `status`=3 WHERE max_num = now_num AND start_time > ?', [now]);
    // console.log(updGroupStatusAudit);

    // 人數已額滿：更新成員審核狀態
    let [updPartStatus] = await pool.execute('UPDATE `group_participant` SET `audit_status`=2 WHERE group_id = ?', [req.params.groupId]);
  }

  // response
  res.json({ code: 0, result: 'OK' });
});

// 聊天室
// 聊天歷史資料
router.get('/chat/:groupId', async (req, res) => {
  let [allChat] = await pool.execute(
    'SELECT group_participant.id as chatId, group_participant.group_id as groupId, group_participant.user_id  as userId, user_list.name, user_list.user_img  as userImg, group_chatroom_content.msg_time  as msgTime, group_chatroom_content.content FROM group_chatroom_content JOIN group_participant ON group_chatroom_content.participant_id = group_participant.id JOIN user_list ON group_participant.user_id = user_list.id WHERE group_participant.group_id = ?  ORDER BY group_chatroom_content.msg_time ASC',
    [req.params.groupId]
  );
  let [members] = await pool.execute(
    'SELECT group_participant.id, group_participant.group_id, group_participant.user_id as userId , user_list.name, user_list.user_img as userImg FROM group_participant JOIN user_list ON group_participant.user_id=user_list.id WHERE group_id = ? AND audit_status=1',
    [req.params.groupId]
  );

  let [info] = await pool.execute(
    'SELECT group_participant.id as chatId, group_list.name FROM group_participant JOIN group_list ON group_participant.group_id = group_list.id WHERE group_participant.group_id = ? AND group_participant.user_id = ?;',
    [req.params.groupId, req.query.userId]
  );
  // let [chat] = await pool.execute(
  //   'SELECT group_participant.id as chatId, group_participant.group_id as groupId, group_participant.user_id as userId, group_chatroom_content.msg_time as msgTime, group_chatroom_content.content FROM group_chatroom_content JOIN group_participant ON group_chatroom_content.participant_id = group_participant.id WHERE group_participant.group_id = ?',
  //   [req.params.groupId]
  // );

  // response
  res.json({ members: members, data: allChat, info: info });
});
module.exports = router;
