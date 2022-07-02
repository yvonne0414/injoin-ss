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

    //基酒nav
    let [data3] = await pool.execute('SELECT * FROM bartd_material WHERE  bartd_id =?', [data[index].id]);
    // console.log(data3);
    let data3Arr = [];
    data3Arr = data3.map((v, i) => {
      console.log(v);
      if (v.mater_cate_l == 1) {
        return v.mater_cate_m;
      }
    });
    data[index].mater_cate_m = data3Arr;
  }

  // 想要的結果
  // allData=[{id:1, name:米奇拉達 , material:[蕃茄汁, 現榨檸檬汁, 梅林辣醬油, 可樂娜啤酒, Tajin墨西哥調味粉]},{id:2, name:米奇拉達 , material:[蕃茄汁, 現榨檸檬汁, 梅林辣醬油, 可樂娜啤酒, Tajin墨西哥調味粉]}]
  res.json(data);
});

//類別  majorSel大類別 subSel小類別
router.get('/type', async (req, res, next) => {
  let [majorSelData] = await pool.execute('SELECT * FROM `bartd_cate_type` WHERE level = 1');
  let [subSelData] = await pool.execute('SELECT * FROM `bartd_cate_type` WHERE level = 2');
  let majorSel = [];
  let subSel = [[], [], [], []];
  // console.log(subSelData);
  majorSel = majorSelData.map((v, i) => {
    // console.log(v);
    return v.name;
  });
  subSelData.map((v) => {
    switch (v.parent_id) {
      case 1:
        subSel[0].push(v.name);
        break;
      case 2:
        subSel[1].push(v.name);
        break;
      case 3:
        subSel[2].push(v.name);
        break;
      case 4:
        subSel[3].push(v.name);
        break;
    }
  });
  // console.log(majorSel);
  // console.log(subSel);

  // data:{cate:[],content:[[],[]]}
  res.json({ data: { majorSel, subSel } });
});

//篩選
router.get('/bartdtype', async (req, res, next) => {
  let [typem] = await pool.execute('SELECT * FROM bartd_cate_list JOIN bartd_cate_type ON bartd_cate_list.bartd_cate_id_m = bartd_cate_type.id');
  let [types] = await pool.execute('SELECT * FROM bartd_cate_list JOIN bartd_cate_type ON bartd_cate_list.bartd_cate_id_s = bartd_cate_type.id');
  res.json({ typem, types });
});

//搜尋
router.get('/search', async (req, res, next) => {
  console.log(req.query.keyword);
  let [data] = await pool.execute('SELECT * FROM bartd_list WHERE bartd_list.name LIKE ?', [`%${req.query.keyword}%`]);
  res.json(data);
});

//細節頁(取id);
router.get('/detail/:barId', async (req, res, next) => {
  // console.log(req.params.barId);
  //bartd_list
  let [data] = await pool.execute('SELECT * FROM bartd_list WHERE id = ?', [req.params.barId]);
  //console.log(data);

  //bartd_material(材料)
  for (let index = 0; index < data.length; index++) {
    let [data2] = await pool.execute('SELECT * FROM bartd_material WHERE bartd_id =?', [data[index].id]);
    let materialArr = [];
    materialArr = data2.map((v, i) => {
      // console.log(v);
      return v.name;
    });
    data[index].material = materialArr;

    //容量
    let materAmountArr = [];
    materAmountArr = data2.map((v, i) => {
      // console.log(v);
      return v.mater_amount;
    });
    data[index].mater_amount = materAmountArr;
    // let materialAll = [...materAmountArr, ...mater_amount];
    // data[index].materialAll = materialAll;
  }

  if (data.legth === 0) {
    res.status(404).json(data);
  } else {
    res.json(data);
  }
});
module.exports = router;
