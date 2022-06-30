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

//酒譜
const BarRouter = require('./routers/barRouter');
app.use('/api/bar', BarRouter);

// 揪團
const GroupRouter = require('./routers/groupRouter');
app.use('/api/group', GroupRouter);

// 註冊登入
const AuthRouter = require('./routers/authRouter');
app.use('/api/auth', AuthRouter);
const MemberRouter = require('./routers/memberRouter');
app.use('/api/member', MemberRouter);

// 關於登入者資訊
const UserRouter = require('./routers/userRouter');
app.use('/api/userlike', UserRouter);

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

// app.listen(3001, () => {
//   console.log('Server start at 3001');
// });
//將 express 放進 http 中開啟 Server 的 3001 port ，正確開啟後會在 console 中印出訊息
const server = require('http')
  .Server(app)
  .listen(3001, () => {
    console.log('Server start at 3001');
  });
//將啟動的 Server 送給 socket.io 處理
const socket = require('socket.io');
const { default: axios } = require('axios');
// const io = socket(server);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

//監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
io.on('connection', (socket) => {
  //經過連線後在 console 中印出訊息
  // console.log('success connect!');

  //監聽透過 connection 傳進來的事件
  socket.on('addRoom', (room) => {
    //加入前檢查是否已有所在房間
    const nowRoom = Object.keys(socket.rooms).find((room) => {
      return room !== socket.id;
    });
    //有的話要先離開
    if (nowRoom) {
      socket.leave(nowFoom);
    }
    //再加入新的
    socket.join(room);
    // socket.emit('addRoom', `已加入聊天室 ${room}！`);
    // socket.to(room).emit('addRoom', '已有新人加入聊天室！');
  });

  socket.on('getMessage', async (message, room) => {
    //加入前檢查是否已有所在房間
    const nowRoom = Object.keys(socket.rooms).find((room) => {
      return room !== socket.id;
    });
    //有的話要先離開
    if (nowRoom) {
      socket.leave(nowFoom);
    }
    //再加入新的
    socket.join(room);
    // console.log(message);

    // TODO:存對話到資料庫(groupId, userId, content, time)
    let [content] = await pool.execute('INSERT INTO group_chatroom_content (participant_id, msg_time, content) VALUES (?, ?, ?)', [
      message.chatId,
      message.msgTime,
      message.content,
    ]);

    //回傳 message 給發送訊息的 Client
    io.sockets.in(room).emit('getMessage', message);
  });

  //送出中斷申請時先觸發此事件
  socket.on('disConnection', (message, room) => {
    //加入前檢查是否已有所在房間
    const nowRoom = Object.keys(socket.rooms).find((room) => {
      return room !== socket.id;
    });
    //有的話要先離開
    if (nowRoom) {
      socket.leave(nowFoom);
    }
    //再加入新的
    socket.join(room);
    //先通知同一 room 的其他 Client
    // socket.to(room).emit('leaveRoom', `${message} 已離開聊天！`);

    //再送訊息讓 Client 做 .close()
    socket.emit('disConnection', '');
  });

  //中斷後觸發此監聽
  socket.on('disconnect', () => {
    console.log('disconnection');
  });
});
