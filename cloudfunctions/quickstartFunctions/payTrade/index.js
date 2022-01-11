const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const log = cloud.logger()
  
exports.main = async (event, context) => {
  try{
    let public = await db.collection('public').doc("287a53aa61adee4100ba68a821f0aae3").get();
    // console.log("public",public)
    let totalFee = 0;
    if(event.currency == "JPY"){
      totalFee=Math.ceil(parseInt(event.amount_to_pay)*public.data.JPY_to_CNY) 
    }else{
      totalFee = parseInt(event.amount_to_pay)
    }
    // console.log("totalFee", totalFee)
    const wxContext = await cloud.getWXContext();
    let is_admin= (wxContext.OPENID === "onlNR5CLE8pj91ZhS1PkZaDv9OfU")
    // log.info({
    //   open_id:wxContext.OPENID,
    //   is_admin:is_admin
    // })
    let response = await db.collection('payment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        //delivery_id:event.delivery_id,
        type:1,
        is_paid:false,
        totalFee:totalFee,
        currency:"CNY",
        product_id:event.product_id,
        sku_index:event.sku_index,
        pick_up_spot:event.pick_up_spot,
        miniprogram_open_id:wxContext.OPENID,
        union_id:wxContext.UNIONID
      }
    });
    // console.log("response",response)

          // "totalFee" : totalFee*100,
    const res = await cloud.cloudPay.unifiedOrder({
      "body" : "霓虹町指南-结算",
      "outTradeNo" : response._id,
      "spbillCreateIp" : "127.0.0.1",
      "subMchId" : "1614594513", //商户号
      "totalFee" : is_admin?100:totalFee*100,
      "envId": "testbai-6gjgkia55f6d4918",
      "functionName": "payDeliveryCallback"
    })
    console.log("res",res)
    return {res:res,payment_id:response._id}
  }catch(e){
    console.log(e)
    return e
  }
}