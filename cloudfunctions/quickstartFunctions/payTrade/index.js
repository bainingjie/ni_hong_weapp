const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
  
exports.main = async (event, context) => {
  console.log(0);
  try{
     let response = await db.collection('payment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        //delivery_id:event.delivery_id,
        is_paid:false,
        totalFee:event.amount_to_pay
      }
    });
    console.log(1);
    const res = await cloud.cloudPay.unifiedOrder({
      "body" : "霓虹町指南-购物结算",
      "outTradeNo" : response._id,
      "spbillCreateIp" : "127.0.0.1",
      "subMchId" : "1614594513", //商户号
      "totalFee" : parseInt(event.amount_to_pay)*100,
      "envId": "testbai-6gjgkia55f6d4918",
      "functionName": "payDeliveryCallback"
    })
    console.log(2);
    return res
  }catch(e){
    console.log(e)
    return e
  }
}