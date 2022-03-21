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
                      "value":"请尽快付款",
                      "color":"#173177"
                  },
                  "remark":{
                      "value":`计费总重量为${delivery.total_weight}kg。待包裹寄达日本后，公众号会再次通知您~⸜( •⌄• )⸝`,
                      "color":"#173177"
                  }
          }
      };
      let admin_config ={
        "touser":"oeWiL54aqo92Cc1UONS58t812UV4",
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
                    "value":"请尽快付款~",
                    "color":"#173177"
                },
                "remark":{
                    "value":`计费总重量为${delivery.total_weight}kg。待包裹寄达日本后，公众号会自动通知您~⸜( •⌄• )⸝`,
                    "color":"#173177"
                }
        }
    };
      await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, admin_config);
      let response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, config);
      console.log(response)
      if(response.data.errcode==0){
        console.log("delivery_id ",delivery._id," 成功发送模板消息")
        response = await db.collection("delivery").doc(delivery._id).update({
          data:{
            is_quote_message_sent:true
          }
        })
        if(response.stats.updated !=1){
          console.log("delivery_id ",delivery._id," is_quote_message_sent 更新失败")
        }
        console.log(response)
      }else{
        console.log("delivery_id",delivery._id," 发送模板消息失败")
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
    console.log("deliveries",deliveries)
    for(let delivery of deliveries){
      await sendMessage(token,delivery)
    }
  }catch(e){
    console.log(e)
  }
}