const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// /api/cart/getPrdDetail?prdId=2
router.get("/getPrdDetail", async(req,res,next)=>{
  // 防呆
  prdId = req.query.prdId || 1
  // console.log(prdId);
  let [data]= await pool.execute("SELECT prd_list.id,prd_list.main_img AS cartprdImg, prd_list.prd_num AS cartprdNum, prd_list.name AS cartprdName , prd_list.price AS cartprdPrice FROM `prd_list` WHERE id = ?",[prdId])
  // console.log(data);
  res.json(data)
})

// router.get('/', async (req, res, next) => {
//   let [data, fields] = await pool.execute(
//     'SELECT order_list.*, user_list.name as userName, logistics_state_cate.name as logiStaCateName, logistics_cate.name as logiCateName FROM order_list JOIN user_list ON order_list.user_id = user_list.id JOIN logistics_cate ON order_list.logistics = logistics_cate.id JOIN logistics_state_cate ON order_list.logistics_state = logistics_state_cate.id;'
//   );
//   res.json(data);
// });





// 訂單成立
router.post('/', async (req, res) => {
  console.log('in');
  // 生成orderId(uuid)
  const { v4: uuidv4 } = require('uuid');

  // order_list
  const orderId = uuidv4();
  const userId = req.body.userId;
  const couponId = req.body.userId || 0;
  const total = req.body.total;
  const logistics = req.body.logistics;

  const cartList = req.body.cartList;
  console.log(cartList);

  try {
    // orderList: orderId / user_id / total / logistics(1:郵局, 2:黑貓) / logistics_state(出貨狀態, 1) / order_time
    let [result] = await pool.execute('INSERT INTO `order_list` (`id`, `user_id`,`coupon_id`, `total`, `logistics`, `logistics_state`) VALUES (?, ?, ?, ?, ?, 1)', [
      orderId.toString(),
      userId,
      couponId,
      total,
      logistics,
    ]);

    // 檢查是否需升級 並 更新消費金額
    let [userInfoList] = await pool.execute('SELECT vip_level, consumption FROM user_list WHERE id = ?', [userId]);
    let userInfo = userInfoList[0];
    let newConsumption = Number(userInfo.consumption) + Number(total);

    let vip2Cost = 5000;
    let vip3Cost = 7000;
    if (userInfo.vip_level < 2 && newConsumption > vip2Cost) {
      let [updConsumption] = await pool.execute('UPDATE user_list SET vip_level= 2, consumption = ? WHERE id = ?', [newConsumption, userId]);
    } else if (userInfo.vip_level < 3 && newConsumption > vip3Cost) {
      let [updConsumption] = await pool.execute('UPDATE user_list SET vip_level= 3, consumption = ? WHERE id = ?', [newConsumption, userId]);
    } else {
      let [updConsumption] = await pool.execute('UPDATE user_list SET consumption = ? WHERE id = ?', [newConsumption, userId]);
    }

    // orderDetail: orderId / prd_id / amount / price / subtotal / is_review(0) / is_packaging(0) / packaging_cate(1)
    for (i = 0; i < cartList.length; i++) {
      let [detailResult] = await pool.execute(
        'INSERT INTO `order_detail` (`order_id`, `prd_id`, `price`, `amount`, `subtotal`, `is_review`, `is_packaging`, `packaging_cate`) VALUES (?, ?, ?, ?, ?, 1, 0, 1)',
        [orderId, cartList[i].prdId, cartList[i].price, cartList[i].amount, cartList[i].subTotal]
      );

      // 更新銷售數量、庫存
      let [oldPrd] = await pool.execute('SELECT inventory_quantity, sale_quantity FROM prd_list WHERE id = ?', [cartList[i].prdId]);
      let newInventoryNum = Number(oldPrd[0].inventory_quantity) - 1;
      let newSaleNum = Number(oldPrd[0].sale_quantity) + 1;
      if (newInventoryNum <= 0) {
        let [updPrdSale] = await pool.execute('UPDATE prd_list SET inventory_quantity = ?, sale_quantity = ?, status = 2 WHERE id= ?', [
          newInventoryNum,
          newSaleNum,
          cartList[i].prdId,
        ]);
      } else {
        let [updPrdSale] = await pool.execute('UPDATE prd_list SET inventory_quantity = ?, sale_quantity = ? WHERE id= ?', [newInventoryNum, newSaleNum, cartList[i].prdId]);
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ code: 3001, error: e });
  }
  console.log(orderId);

  // console.log(orderId);

  // response
  res.json({ code: 200, result: 'ok' });
});

module.exports = router;
