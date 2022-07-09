// express
const express = require('express');
const router = express.Router();

// db
const pool = require('../utils/db');

// nodemailer
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  //   service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

// api/rest
router.get('/', async (req, res, next) => {
  const mail = req.query.mail;
  // console.log(mail);
  let [data] = await pool.execute('SELECT * FROM `user_list` WHERE email=?', [mail]);
  // console.log(data);
  if (data.length == 0) {
    return res.status(400).json({ code: 3002, error: '這個信箱尚未註冊過唷' });
  }
  //   console.log(process.env.MAIL_ADDRESS);
  //   console.log(mail);
  transporter
    .sendMail({
      from: process.env.MAIL_ADDRESS,
      to: mail,
      subject: 'INJOIN忘記密碼郵件',
      html: `
      <div>
         <a href=${process.env.FRONTENF_URL}/   resetPassword/${mail}>點選此處重製密碼</a>
      </div>
    `,
    })
    .then((info) => {
      console.log({ info });
    })
    .catch(console.error);
  res.json({ code: 0, message: '請至信箱收信並更改密碼' });
});

module.exports = router;
