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
                      "value":`在您选择完取货时间后，商品将会被配送至自提点。取货时出示取货码即可，请记得自带包/袋哦 (ㅅ •͈ᴗ•͈)`,
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
                    "value":`在您选择完取货时间后，商品将会被配送至自提点。取货时出示取货码即可，请记得自带包/袋哦 (ㅅ •͈ᴗ•͈)`,
                    "color":"#173177"
                }
        }
    };

      console.log(admin_config)
      let response = null
      if(!delivery.is_pickupTimeSelector_sent){
        await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, admin_config);
        response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, config);
      }
      
      console.log(response)
      let tiktea_times = {
        "1/31(月)":["16:30-20:30"],
        "2/1(火)":["11:30-14:00","14:00-17:00","17:00-20:30"],
        "2/2(水)":["11:30-14:00","14:00-17:00","17:00-20:30"],
        "2/3(木)":["11:30-14:00","14:00-17:00","17:00-20:30"],
        "2/4(金)":["11:30-14:00","14:00-17:00","17:00-20:30"],
        "2/5(木)":["11:30-14:00","14:00-17:00","17:00-20:30"],
        "2/6(日)":["11:30-14:00","14:00-17:00","17:00-20:30"]
    }
    let kyoto_times = {
      "1/31(月)":["20:00-21:00","21:00-24:00"],
      "2/1(火)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "2/2(水)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "2/3(木)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "2/4(金)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "2/5(土)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"],
      "2/6(日)":["13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00","21:00-24:00"]
    }
    let ookayama_times = {
      "2/1(火)":["11:00-14:00","14:00-17:00","17:00-20:00"],
      "2/2(水)":["11:00-14:00","14:00-17:00","17:00-20:00"],
      "2/3(木)":["11:00-14:00","14:00-17:00","17:00-20:00"],
      "2/4(金)":["11:00-14:00","14:00-17:00","17:00-20:00"],
      "2/5(木)":["11:00-14:00","14:00-17:00","17:00-20:00"],
      "2/6(日)":["11:00-14:00","14:00-17:00","17:00-20:00"],
      "2/7(月)":["11:00-14:00","14:00-17:00","17:00-20:00"]
  }
    // response = await db.collection("delivery").doc(delivery._id).update({
    //   data:{
    //     is_pickupTimeSelector_sent:true,
    //     state:"待选择取货时间",
    //     times:tiktea_times
    //   }
    // })
      if(response.data.errcode==0){
        console.log("delivery_id ",delivery._id," 成功发送模板消息")
        response = await db.collection("delivery").doc(delivery._id).update({
          data:{
            is_pickupTimeSelector_sent:true,
            state:"待选择取货时间",
            times:kyoto_times
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
    let delivery_array = 
        // 1)delivery_array
        // 2)录入取货码至数据库
        // 3）修改取货时间
    [
      "17e3426e61e2d9cd069e5808447083e4",
      "17e3426e61e5323d070afe907e4fac35",
      "54ad1eea61e68eae083e8476506432e3"
    ]
    // ["54ad1eea61e526ff07cb08e41ec84011"]
    

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