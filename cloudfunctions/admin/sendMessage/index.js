const cloud = require('wx-server-sdk')
cloud.init()

const axios = require('axios');
const db = cloud.database();


async function sendMessage(ACCESS_TOKEN,delivery){
  try{
      let user = await db.collection("official_account_user").where({
        unionid:delivery.union_id
      }).get()
      // console.log(user.data)
      if(user.data.length == 0){
        console.log("delivery_id: ",delivery._id,", user is not following official account")
        return 1;
      }
      let config={
          "touser":user.data[0].openid,
          "template_id":"M8wO6z5hbfuMvT43MK2HgSkbKBt_z4Bc9U3Fr9RNLf0",
          "url":"http://weixin.qq.com/download",
          "miniprogram":{
            "appid":"wxf3ecc758c5fb4028",
            "pagepath":`/pages/getDelivery/index?param=${delivery._id}`
            // "pagepath":"index?foo=bar"
          },          
          "data":{
                  "first": {
                      "value":"您有一笔订单未付款",
                      "color":"#173177"
                  },
                  "keyword1":{
                      "value":"霓虹町指南-集运",
                      "color":"#173177"
                  },
                  "keyword2": {
                      "value":delivery._id,
                      "color":"#173177"
                  },
                  "keyword3": {
                      "value":`${delivery.amount_to_pay}元`,
                      "color":"#173177"
                  },
                  "keyword4": {
                      "value":"请在周五23点前完成付款⸜( •⌄• )⸝",
                      "color":"#173177"
                  },
                  "remark":{
                      "value":`计费总重量为${delivery.total_weight}kg。付款后，订单状态将被更新为“待发货”，我们将尽快安排发货。☺️`,
                      "color":"#173177"
                  }
          }
      };
      let response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, config);

      if(response.data.errcode==0){
        await db.collection("delivery").doc(delivery._id).update({
          data:{
            is_quote_message_sent:true
          }
        })
      }else{
        console.log("delivery_id",delivery._id)
        console.log(response)
        console.log("=====")
      }

      return 0
  }catch(e){
      console.log(e)
      return 1
  }
}


// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let res = await db.collection("public").doc("c0ca0aed61c3d73301ffd88d515bcb72").get();
    let token = res.data.accessToken;
    let deliveries = await db.collection("delivery").where({
      is_quote_message_sent:false,
      state:"待支付"
    }).get();
    deliveries = deliveries.data
    for(let delivery of deliveries){
      await sendMessage(token,delivery)
    }
  }catch(e){
    console.log(e)
  }
}