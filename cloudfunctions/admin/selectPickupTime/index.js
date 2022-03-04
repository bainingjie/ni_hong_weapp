const cloud = require('wx-server-sdk')
cloud.init()

const axios = require('axios');
const db = cloud.database();
const _ = db.command;

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
          "template_id":"0LLI8zBo0xT5EcLDQyETXPaXkVtQmIV-vJdUh_YvQfw",
          "url":"http://weixin.qq.com/download",
          "miniprogram":{
            "appid":"wxf3ecc758c5fb4028",
            "pagepath":`/pages/selectPickupTime/index?param=${delivery._id}`
            // "pagepath":"index?foo=bar"
          },  
          
        
          "data":{
                  "first": {
                      "value":"请选择取货时间",
                      "color":"#173177"
                  },
                  "keyword1":{
                      "value":delivery.pickup_code,
                      "color":"#173177"
                  },
                  "keyword2": {
                      "value":delivery.pickup_spot,
                      "color":"#173177"
                  },
                  "keyword3": {
                      "value":"请查看自提点详情页",
                      "color":"#173177"
                  },
                  "remark":{
                      "value":`在您选择完取货时间后，商品将会被配送至自提点，出示取货码即可取件。 (ㅅ •͈ᴗ•͈)`,
                      "color":"#173177"
                  }
          }
      };
    
      let admin_config = {
        "touser":"oeWiL54aqo92Cc1UONS58t812UV4",
        "template_id":"0LLI8zBo0xT5EcLDQyETXPaXkVtQmIV-vJdUh_YvQfw",
        "url":"http://weixin.qq.com/download",
        "miniprogram":{
          "appid":"wxf3ecc758c5fb4028",
          "pagepath":`/pages/selectPickupTime/index?param=${delivery._id}`
          // "pagepath":"index?foo=bar"
        },  
        
      
        "data":{
                "first": {
                    "value":"请选择取货时间",
                    "color":"#173177"
                },
                "keyword1":{
                    "value":delivery.pickup_code,
                    "color":"#173177"
                },
                "keyword2": {
                    "value":delivery.pickup_spot,
                    "color":"#173177"
                },
                "keyword3": {
                    "value":"请查看自提点详情页",
                    "color":"#173177"
                },
                "remark":{
                    "value":`在您选择完取货时间后，商品将会被配送至自提点。取货时请记得自带包/袋哦 (ㅅ •͈ᴗ•͈)`,
                    "color":"#173177"
                }
        }
    };

      console.log(admin_config)
      await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, admin_config);

      let response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, config);
      console.log(response)
      let tiktea_times = {
        "2/2(水)":["14:00-17:00","17:00-20:30"],
        "2/3(木)":["12:30-14:00","14:00-17:00","17:00-20:30"],
        "2/4(金)":["12:30-14:00","14:00-17:00","17:00-20:30"],
        "2/5(土)":["12:30-14:00","14:00-17:00","17:00-20:30"],
        "2/6(日)":["12:30-14:00","14:00-17:00","17:00-20:30"],
        "2/7(月)":["12:30-14:00","14:00-17:00","17:00-20:30"],
        "2/8(火)":["12:30-14:00","14:00-17:00","17:00-20:30"]
    }
    let kyoto_times = {
      "1/25(火)":["18:00-21:00","21:00-24:00"],
      "1/26(水)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "1/27(木)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "1/28(金)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "1/29(土)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "1/30(日)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "1/31(月)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"]
    }
      if(response.data.errcode==0){
        console.log("delivery_id ",delivery._id," 成功发送模板消息")
        response = await db.collection("delivery").doc(delivery._id).update({
          data:{
            is_pickupTimeSelector_sent:true,
            state:"待选择取货时间",
            times:tiktea_times
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


// 1)delivery_array
// 2)times
// 
// 
exports.main = async (event, context) => {
  try{
    let res = await db.collection("public").doc("c0ca0aed61c3d73301ffd88d515bcb72").get();
    let token = res.data.accessToken;
    let delivery_array = [
      "17e3426e61e42dce06d143120b96c692"
    ]
    let deliveries = await db.collection("delivery").where({
        _id: _.in(delivery_array)
      }).get()
    deliveries = deliveries.data
    for(let delivery of deliveries){
      await sendMessage(token,delivery)
    }
  }catch(e){
    console.log(e)
  }
}