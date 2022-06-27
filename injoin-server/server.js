// 利用 epxress 來建立一個 express application
const express = require('express');
const app = express();

const path = require('path');
require('dotenv').config();

// 啟用 session
// npm i express-session
// express-session 預設是存在應用程式的記體體 (node server.js)
// session-file-store 這個是為了把 session 存到硬碟去讓你們觀察
// npm i session-file-store
// 正式環境我們會在「記憶體」--> redis, memcached (database in memory)
// console.log('secret', process.env.SESSION_SECRET);
const expressSession = require('express-session');
let FileStore = require('session-file-store')(expressSession);
app.use(
  expressSession({
    store: new FileStore({
      // 把 sessions 存到 simple-express 的外面
      // 單純想避開 nodemon 的監控檔案變動重啟
      path: path.join(__dirname, '..', 'sessions'),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// 使用第三方開發的中間件 cors，允許跨域
const cors = require('cors');
// 這樣全開，但不包含跨源讀寫 cookie
// app.use(cors());
// origin: *
// 如果想要跨源讀寫 cookie
app.use(
  cors({
    // 為了要讓 browser 在 CORS 的情況下，還是幫我們縙 cookie
    // 這邊需要把 credentials 設定成 true，而且 origin 不可以是 *
    // 不然就太恐怖，誰都可以跨源讀寫 cookie
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// express.urlencoded 要讓 express 認得 req 裡 body 裡面的資料
// extended: false --> querystring
// extended: true --> qs
app.use(express.urlencoded({ extended: true }));
// 要讓 express 認得 req 裡 json
app.use(express.json());

// require('dotenv').config();

const pool = require('./utils/db');

app.use('/images', express.static(path.join(__dirname, 'public')));
// http://localhost:3001/images/groupupload/1655978777594.svg

// // 使用者頭像上傳
// app.use('/images/members', express.static(path.join(__dirname, 'public','members')));
// // http://localhost:3001/images/members/1655978777594.svg

// RESTful API
app.get('/', (req, res) => {
  res.send('home');
});

// 商品
const PrdRouter = require('./routers/prdRouter');
app.use('/api/prd', PrdRouter);

// 揪團
const GroupRouter = require('./routers/groupRouter');
app.use('/api/group', GroupRouter);

// 訂單
const OrderRouter = require('./routers/orderRouter');
app.use('/api/order', OrderRouter);

// 優惠券
const CouponRouter = require('./routers/couponRouter');
app.use('/api/coupon', CouponRouter);

// 註冊登入
const AuthRouter = require('./routers/authRouter');
app.use('/api/auth', AuthRouter);
const MemberRouter = require('./routers/memberRouter');
app.use('/api/member', MemberRouter);

// global
const GlobalRouter = require('./routers/globalRouter');
app.use('/api', GlobalRouter);

// 會跳到最下方 5xx error
app.get('/error', (req, res, next) => {
  // 發生錯誤，你丟一個錯誤出來
  // throw new Error('測試測試');
  // 或是你的 next 裡有任何參數
  next('我是正確的');
  // --> 都會跳去錯誤處理中間件
});

// 404
app.use((req, res, next) => {
  // console.log('所有路由的後面 ==> 404', req.path);
  res.status(404).send('Not Found');
});

// 5xx 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('來自四個參數的錯誤處理中間件', req.path, err);
  res.status(500).send('Server Error: 請洽系統管理員');
});

app.listen(3001, () => {
  console.log('Server start at 3001');
});
