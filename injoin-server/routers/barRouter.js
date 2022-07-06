const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
const { default: axios } = require('axios');

// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置
const storage = multer.diskStorage({
  // 設定儲存的目的地 （檔案夾）
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'bartending'));
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
// router.get('/detail/:barId', async (req, res, next) => {
//   // console.log(req.params.barId);
//   //bartd_list
//   let [data] = await pool.execute('SELECT * FROM bartd_list WHERE id = ?', [req.params.barId]);
//   //console.log(data);

//   //bartd_material(材料)
//   for (let index = 0; index < data.length; index++) {
//     let [data2] = await pool.execute('SELECT * FROM bartd_material WHERE bartd_id =?', [data[index].id]);
//     let materialArr = [];
//     materialArr = data2.map((v, i) => {
//       // console.log(v);
//       return v.name;
//     });
//     data[index].material = materialArr;

//     //容量
//     let materAmountArr = [];
//     materAmountArr = data2.map((v, i) => {
//       // console.log(v);
//       return v.mater_amount;
//     });
//     data[index].mater_amount = materAmountArr;
//     // let materialAll = [...materAmountArr, ...mater_amount];
//     // data[index].materialAll = materialAll;
//   }

//   if (data.legth === 0) {
//     res.status(404).json(data);
//   } else {
//     res.json(data);
//   }
// });
// router.get('/:bartd_listID', async (req, res, next) => {
//   let [data] = await pool.execute('SELECT * FROM `bartd_list` WHERE id = ' + req.params.bartd_listID);
//   res.json(data);
// });
// 詳細頁
router.get('/detail/:barId', async (req, res, next) => {
  // console.log(req.params.barId);
  //bartd_list
  let [data] = await pool.execute('SELECT * FROM bartd_list WHERE id = ?', [req.params.barId]);
  //console.log(data);

  //bartd_material(材料)
  let [data2] = await pool.execute('SELECT * FROM bartd_material WHERE bartd_id =?', [req.params.barId]);

  // 所屬類型
  let [cateSNameData] = await pool.execute(
    `SELECT bartd_cate_type.name FROM bartd_cate_list JOIN bartd_cate_type ON bartd_cate_list.bartd_cate_id_s = bartd_cate_type.id WHERE bartd_cate_list.bartd_id = ?`,
    [req.params.barId]
  );

  // 有的中分類
  let cateMList = [];
  data2.map((item) => {
    cateMList.push(item.mater_cate_m);
  });
  cateMList = [...new Set(cateMList)];

  // 所屬小分類
  let cateSNameList = [];
  cateSNameData.map((item) => {
    cateSNameList.push(item.name);
  });

  let newdata = { ...data, material: data2, cateMList, cateSNameList };

  if (data.legth === 0) {
    res.status(404).json(data);
  } else {
    res.json(newdata);
  }
});

// 分類
router.get('/cateL', async (req, res) => {
  let [cateL] = await pool.execute('SELECT id, name FROM `bartd_cate_type` WHERE level = 1');
  res.json({ data: cateL });
});
router.get('/cateM', async (req, res) => {
  let [cateM] = await pool.execute('SELECT id, name FROM `bartd_cate_type` WHERE level = 2 AND parent_id = ?', [req.query.cateL]);
  res.json({ data: cateM });
});

// 相關酒譜
router.get(`/related`, async (req, res) => {
  let userId = req.query.userId || -1;

  let [barIdList] = await pool.execute(`SELECT bartd_id FROM bartd_material WHERE mater_cate_m = ?`, [req.query.cateM]);
  let newbarIdList = [];
  barIdList.map((item) => {
    // console.log(item);
    newbarIdList.push(item.bartd_id);
  });
  newbarIdList = [...new Set(newbarIdList)];
  console.log(newbarIdList);

  let data = [];

  for (let i = 0; i < newbarIdList.length; i++) {
    let [barList] = await pool.execute(`SELECT id, name,img FROM bartd_list WHERE id = ?`, [newbarIdList[i]]);
    let [materList] = await pool.execute(`SELECT * FROM bartd_material WHERE bartd_id = ?`, [newbarIdList[i]]);
    let materNameList = [];
    materList.map((item) => {
      materNameList.push(item.name);
    });

    let [likeData] = await pool.execute(`SELECT * FROM user_bartd_like WHERE user_id = ? AND bartd_id =?`, [userId, newbarIdList[i]]);
    let isBarLike = false;
    if (likeData.length > 0) {
      isBarLike = true;
    }

    data.push({
      ...barList[0],
      material: materNameList,
      isLike: isBarLike,
    });
  }

  res.json({ data });
});

// 首頁酒譜
router.get('/hot', async (req, res) => {
  let [data] = await pool.execute('SELECT id, name, img FROM `bartd_list` LIMIT 10');

  res.json({ data });
});

// 酒譜列表
// 舊的
router.get('/old', async (req, res, next) => {
  // TODO: 抓出有哪些酒譜
  let [data] = await pool.execute('SELECT * FROM `bartd_list`');
  console.log(data);

  for (let index = 0; index < data.length; index++) {
    // console.log(data[index]);
    // TODO: 從id去抓各個酒譜有哪些材料(data: for loop)
    let [data2] = await pool.execute('SELECT * FROM bartd_material WHERE bartd_id =?', [data[index].id]);
    // console.log(data2);
    //把[1,2,3] ==> '1 2 3' 把材料處理成需要的格式
    // let data2Arr = '';
    let data2Arr = [];
    for (let index = 0; index < data2.length; index++) {
      // console.log(data2[index].name);
      // data2Arr = `${data2Arr} ${data2[index].name}`;
      data2Arr.push(data2[index].name);
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
router.get('/', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;
  let category = req.query.category;
  let cateS = Number(req.query.cateS) || 0;
  let keyword = req.query.keyword || '';
  let userId = req.query.userId || -1;

  // 抓出有哪些酒譜
  let barIdList = [];
  let [barIdListData] = await pool.execute('SELECT bartd_id FROM `bartd_material` WHERE mater_cate_m = ?', [category]);
  barIdListData.map((item) => {
    barIdList.push(item.bartd_id);
  });
  barIdList = [...new Set(barIdList)];
  // console.log(barIdList);
  barIdListStr = barIdList.join(',');
  // console.log(barIdListStr);

  let allData = [];
  // 有查詢
  if (keyword !== '') {
    let [data] = await pool.execute(`SELECT * FROM bartd_list WHERE bartd_list.id IN (?) AND bartd_list.name LIKE ?`, [barIdListStr, `%${keyword}%`]);
    allData = data;
  } else if (cateS !== 0) {
    //有小分類
    let [data] = await pool.execute(
      `SELECT bartd_list.*, bartd_cate_list.bartd_cate_id_m, bartd_cate_list.bartd_cate_id_s FROM bartd_list JOIN bartd_cate_list ON bartd_list.id = bartd_cate_list.bartd_id WHERE bartd_list.id IN (?)  AND bartd_cate_list.bartd_cate_id_s = ?`,
      [barIdListStr, cateS]
    );
    allData = data;
  } else {
    let [data] = await pool.execute(`SELECT bartd_list.* FROM bartd_list WHERE bartd_list.id IN (?)`, [`${barIdListStr}`]);
    allData = data;
  }

  // 總數
  const total = allData.length;
  // console.log(total);

  // 計算總頁數
  const perPage = 12; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let pageData = [];

  if (keyword !== '') {
    let [data] = await pool.execute(`SELECT * FROM bartd_list WHERE bartd_list.id IN (?) AND bartd_list.name LIKE ? LIMIT ? OFFSET ?`, [
      barIdListStr,
      `%${keyword}%`,
      perPage,
      offset,
    ]);

    let newData = [];
    for (let i = 0; i < data.length; i++) {
      let material = [];
      let [materialListData] = await pool.execute(`SELECT * FROM bartd_material WHERE bartd_id = ?`, [data[i].id]);
      materialListData.map((mater) => {
        material.push(mater.name);
      });

      let isBarLike = false;
      let [likeData] = await pool.execute(`SELECT * FROM user_bartd_like WHERE bartd_id = ? AND user_id = ?`, [data[i].id, userId]);
      if (likeData.length > 0) {
        isBarLike = true;
      }

      newData.push({ ...data[i], material, isLike: isBarLike });
    }

    pageData = newData;
  } else if (cateS !== 0) {
    //有小分類
    let [data] = await pool.execute(
      `SELECT bartd_list.*, bartd_cate_list.bartd_cate_id_m, bartd_cate_list.bartd_cate_id_s FROM bartd_list JOIN bartd_cate_list ON bartd_list.id = bartd_cate_list.bartd_id WHERE bartd_list.id IN (?)  AND bartd_cate_list.bartd_cate_id_s = ? LIMIT ? OFFSET ?`,
      [barIdListStr, cateS, perPage, offset]
    );

    let newData = [];
    for (let i = 0; i < data.length; i++) {
      let material = [];
      let [materialListData] = await pool.execute(`SELECT * FROM bartd_material WHERE bartd_id = ?`, [data[i].id]);
      materialListData.map((mater) => {
        material.push(mater.name);
      });

      let isBarLike = false;
      let [likeData] = await pool.execute(`SELECT * FROM user_bartd_like WHERE bartd_id = ? AND user_id = ?`, [data[i].id, userId]);
      if (likeData.length > 0) {
        isBarLike = true;
      }

      newData.push({ ...data[i], material, isLike: isBarLike });
    }

    pageData = newData;
  } else {
    let [data] = await pool.execute(`SELECT bartd_list.* FROM bartd_list WHERE bartd_list.id IN (?) LIMIT ? OFFSET ?`, [barIdListStr, perPage, offset]);

    let newData = [];
    for (let i = 0; i < data.length; i++) {
      let material = [];
      let [materialListData] = await pool.execute(`SELECT * FROM bartd_material WHERE bartd_id = ?`, [data[i].id]);
      materialListData.map((mater) => {
        material.push(mater.name);
      });

      let isBarLike = false;
      let [likeData] = await pool.execute(`SELECT * FROM user_bartd_like WHERE bartd_id = ? AND user_id = ?`, [data[i].id, userId]);
      if (likeData.length > 0) {
        isBarLike = true;
      }

      newData.push({ ...data[i], material, isLike: isBarLike });
    }

    pageData = newData;
  }

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});

router.get('/be/list', async (req, res) => {
  let [data] = await pool.execute(`SELECT * FROM bartd_list ORDER BY id DESC`);
  let page = req.query.page || 1;
  const total = data.length;
  // 計算總頁數
  const perPage = 8; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  let [prdListPageData] = await pool.execute('SELECT * FROM bartd_list ORDER BY id DESC LIMIT ? OFFSET ?', [perPage, offset]);

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: prdListPageData,
  });
});

// 新增酒譜
router.post('/', uploader.single('bartdImg'), async (req, res) => {
  let name = req.body.name;
  let img = req.file ? '/bartending/' + req.file.filename : '';
  let recipe = req.body.recipe;
  let materialList = req.body.materialList;
  let bartdCateList = req.body.bartdCateList;
  // console.log('data', { name, img, recipe, materialList, bartdCateList });
  // materialList = materialList.split(',\n');
  // console.log(materialList);
  // materialList = materialList.toString();
  // console.log(materialList);
  // console.log(materialList.split('br'));
  // console.log(JSON.parse(materialList.split('br')[0]));
  // materialList = materialList.split('br').map((item) => {
  //   return JSON.parse(item);
  // });
  materialList = JSON.parse(materialList);
  console.log(materialList);

  // bartdCateList = bartdCateList.split(',\n');
  // bartdCateList = bartdCateList.toString();
  // bartdCateList = bartdCateList.split('br').map((item) => {
  //   return JSON.parse(item);
  // });
  bartdCateList = JSON.parse(bartdCateList);

  console.log(bartdCateList);

  // bartd_list
  let [bartdListResult] = await pool.execute('INSERT INTO bartd_list (name, img, recipe) VALUES (?, ?, ?)', [name, img, recipe]);

  // bartd_material
  for (i = 0; i < materialList.length; i++) {
    let [bartdLMaterialResult] = await pool.execute('INSERT INTO bartd_material (bartd_id, name, mater_amount, mater_cate_l, mater_cate_m) VALUES (?, ?, ?, ?, ?)', [
      bartdListResult.insertId,
      materialList[i].name,
      materialList[i].materAmount,
      materialList[i].materCateL,
      materialList[i].materCateM,
    ]);
  }

  // bartd_cate_list
  for (i = 0; i < bartdCateList.length; i++) {
    let [bartdCateResult] = await pool.execute('INSERT INTO bartd_cate_list (bartd_id, bartd_cate_id_m, bartd_cate_id_s) VALUES (?, ?, ?)', [
      bartdListResult.insertId,
      bartdCateList[i].bartdMaterCateM,
      bartdCateList[i].bartdMaterCateS,
    ]);
  }

  res.json({ code: 0, result: 'ok' });
});
module.exports = router;
