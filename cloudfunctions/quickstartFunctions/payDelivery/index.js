const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
  
exports.main = async (event, context) => {
  try{
     let response = await db.collection('payment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        delivery_id:event.delivery_id,
        is_paid:false,
        totalFee:event.amount_to_pay
      }
    });
    const res = await cloud.cloudPay.unifiedOrder({
      "body" : "霓虹町指南-集运运费",
      "outTradeNo" : response._id,
      "spbillCreateIp" : "127.0.0.1",
      "subMchId" : "1614594513",
      "totalFee" : parseInt(event.amount_to_pay)*100,
      "envId": "testbai-6gjgkia55f6d4918",
      "functionName": "payDeliveryCallback"
    })
    return res
  }catch(e){
    console.log(e)
    return e
  }



}