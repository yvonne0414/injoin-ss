const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

router.get('/', async (req, res, next) => {
  // console.log('我是test');
  // TODO: 抓出有哪些酒譜
  let [data, fields] = await pool
    .execute
    // 'SELECT bartd_list.*, bartd_material.bartd_id AS bartd_material_bartd_id, bartd_material.name AS bartd_material_name FROM bartd_list JOIN bartd_material ON bartd_list.id = bartd_material.bartd_id' ''
    ();

  // TODO: 從id去抓各個酒譜有哪些材料(data: for loop)

  // TODO: 把材料存入各id的{}

  // allData=[{id:1, name:米奇拉達 , material:[蕃茄汁, 現榨檸檬汁, 梅林辣醬油, 可樂娜啤酒, Tajin墨西哥調味粉]},{id:2, name:米奇拉達 , material:[蕃茄汁, 現榨檸檬汁, 梅林辣醬油, 可樂娜啤酒, Tajin墨西哥調味粉]}]

  res.json(data);
});

module.exports = router;
