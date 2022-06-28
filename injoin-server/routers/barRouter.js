const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

//酒譜列表
router.get('/', async (req, res, next) => {
  // TODO: 抓出有哪些酒譜
  let [data] = await pool.execute('SELECT * FROM `bartd_list`');

  for (let index = 0; index < data.length; index++) {
    // console.log(data[index]);
    // TODO: 從id去抓各個酒譜有哪些材料(data: for loop)
    let [data2] = await pool.execute('SELECT * FROM bartd_material WHERE bartd_id =?', [data[index].id]);
    // console.log(data2);
    //把[1,2,3] ==> '1 2 3' 把材料處理成需要的格式
    let data2Arr = '';
    for (let index = 0; index < data2.length; index++) {
      // console.log(data2[index].name);
      data2Arr = `${data2Arr} ${data2[index].name}`;
    }
    // TODO: 把材料存入各id的{}
    // console.log(data2Arr);
    // console.log(data[index]);
    //ex: let obj = {a:0, b:1}  obj.a = 0 obj.b = 1
    //加第三個(c) obj.c=3
    //結果 obj {a:0, b:1, c:3}
    data[index].material = data2Arr;
  }

  // 想要的結果
  // allData=[{id:1, name:米奇拉達 , material:[蕃茄汁, 現榨檸檬汁, 梅林辣醬油, 可樂娜啤酒, Tajin墨西哥調味粉]},{id:2, name:米奇拉達 , material:[蕃茄汁, 現榨檸檬汁, 梅林辣醬油, 可樂娜啤酒, Tajin墨西哥調味粉]}]
  res.json(data);
});

router.get('/type', async (req, res, next) => {
  let [data] = await pool.execute('SELECT * FROM `bartd_cate_type`');
  res.json(data);
});

// let smalltype = '';
// for (let i = 0; i < smalltype.length; i++) {
//   console.log(smalltype[i].name);

// }

// router.get('/:bartd_listID', async (req, res, next) => {
//   let [data] = await pool.execute('SELECT * FROM `bartd_list` WHERE id = ' + req.params.bartd_listID);
//   res.json(data);
// });
module.exports = router;
