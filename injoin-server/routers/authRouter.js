const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../utils/db');

// 雜湊密碼
// npm install bcrypt
const bcrypt = require('bcrypt');

// npm install --save multer
// 接收form data 格式
const multer = require('multer');
// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置
const storage = multer.diskStorage({
  // 設定儲存的目的地 （檔案夾）
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'members'));
  },
  // 重新命名使用者上傳的圖片名稱
  filename: function (req, file, cb) {
    // 剛學習一個新的套件，可以把拿到的物件或變數印出來看看
    // 看看裡面有沒有放什麼有用的東西
    // console.log('multer filename', file);
    // 通常我們會選擇重新命名使用者上傳的圖片名稱
    // 以避免重複的檔名或是惡意名稱，也比較好管理
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
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
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
    fileSize: 1024 * 1024,
  },
});

// npm install express-validator
// 驗證資料
const { body, validationResult } = require('express-validator');
const registerRules = [
  body('useremail').isEmail().withMessage('Email 欄位請填寫正確格式'),
  body('userpassword').isLength({ min: 8 }).withMessage('密碼長度至少為8'),
  body('userconfirmpassword')
    .custom((value, { req }) => {
      return value === req.body.userpassword;
    })
    .withMessage('密碼驗證不一致'),
];

// photo 特別處理
// api/auth/register
router.post('/register', uploader.single('userphoto'), registerRules, async (req, res, next) => {
  // console.log('register: ', req.body);
  // 驗證資料
  const validateResults = validationResult(req);
  // console.log('validateResults： ', validateResults);
  if (!validateResults.isEmpty()) {
    let error = validateResults.array();
    return res.status(400).json({ code: 3001, error: error });
  }

  // 年齡
  if (req.body.userage < 18){
    return res.status(400).json({ code: 3003, error: '未滿18歲' });
  }

  // 檢查有沒有註冊過
  let [member] = await pool.execute('SELECT id, email FROM user_list WHERE email = ?', [req.body.useremail]);
  if (member.length !== 0) {
    return res.status(400).json({ code: 3002, error: '已經註冊過' });
  }

  // 雜湊密碼
  // console.log(req.body.password);
  let hashPassword = await bcrypt.hash(req.body.userpassword, 10);
  // console.log(hashPassword);

  // 圖片處理完成後
  // console.log('req.file', req.file);
  // 有給照片就留 沒給就給其他的 ?
  let photo = req.file ? '/members/' + req.file.filename : '';

  // http://localhost:3001/images + /members/Photoname
  // save to db
  // 寫進 user_list 目前止寫入 name email user_img
  let [result] = await pool.execute('INSERT INTO user_list (name,email,user_img,gender,birth_day) VALUE (?,?,?,?,?)', 
  [req.body.username, req.body.useremail,photo,req.body.usergender,req.body.userbirthday]);

  // 最新一筆的 id
  // console.log(result.insertId);

  // 寫進 user_pwd
  await pool.execute("INSERT INTO user_pwd (user_id, passwd) VALUES(?,?) ",[result.insertId, hashPassword])

  res.json({ code: 0, result: 'OK' });
});

// /api/auth
// id email
router.post('/login', async (req, res, next) => {
  // 接收資料
  // console.log("req.body", req.body);

  // 檢查有沒有註冊過
  // chen@test.com
  let [members] = await pool.execute(
    'SELECT user_list.id, user_list.email,user_list.name,user_list.user_img, user_pwd.passwd AS password FROM user_list JOIN user_pwd ON user_list.id = user_pwd.user_id WHERE email = ? ',
    [req.body.loginusermail]
  );
  if (members.length === 0) {
    return res.status(400).json({ code: 3003, error: '尚未註冊過' });
  }
  let member = members[0];

  // 檢查密碼
  // console.log(req.body.loginuserpassword)
  // console.log(member.password)

  let passwordCompareResult = await bcrypt.compare(req.body.loginuserpassword, member.password);
  // console.log(passwordCompareResult);
  if (passwordCompareResult === false) {
    return res.status(400).json({ code: 3004, error: '密碼錯誤' });
  }

  // 開始寫session
  // npm install express-session session-file-store
  // 去 server.js 開啟
  // console.log(member);
  let returnMemver = { id: member.id, email: member.email,name:member.name,img:member.user_img };
  req.session.member = returnMemver;

  res.json({ code: 0, result: "success" });
});

router.get('/logout', (req, res, next) => {
  // 因為我們會依靠判斷 req.session.member 有沒有資料來當作有沒有登入
  // 所以當我們把 req.session.member 設定成 null，那就登出了
  req.session.member = null;
  res.status(202).json({ code: 0, error: 'log out' });
});
router.use('/', (req, res, next) => {
  res.send('auth');
});


module.exports = router;
