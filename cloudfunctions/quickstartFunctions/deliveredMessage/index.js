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
          "template_id":"UULMNrbFYG6pfF43nEo_QHEMEOKDIqrpZDrxZ31wJbs",
          "url":"http://weixin.qq.com/download",
          "miniprogram":{
            "appid":"wxf3ecc758c5fb4028",
            "pagepath":`/pages/getDelivery/index?param=${delivery._id}`
            // "pagepath":"index?foo=bar"
          },  
          
        
          "data":{
                  "first": {
                      "value":`已配送至${delivery.pickup_spot}`,
                      "color":"#173177"
                  },
                  "keyword1":{
                      "value":delivery._id,
                      "color":"#173177"
                  },
                  "keyword2": {
                      "value":`集运(取件码：${delivery.pickup_code})`,
                      "color":"#173177"
                  },
                  "remark":{
                      "value":`商品已经配送至自提点啦，请您今天方便的时间记得取一下哈☺️。因为商品在自提点无法过夜，如有特殊情况无法今天取件，请及时联系我们～`,
                      "color":"#173177"
                  }
          }
      };
    
      let admin_config = {
        "touser":"oeWiL54aqo92Cc1UONS58t812UV4",
        "template_id":"UULMNrbFYG6pfF43nEo_QHEMEOKDIqrpZDrxZ31wJbs",
        "url":"http://weixin.qq.com/download",
        "miniprogram":{
          "appid":"wxf3ecc758c5fb4028",
          "pagepath":`/pages/getDelivery/index?param=${delivery._id}`
          // "pagepath":"index?foo=bar"
        },  
        
   
        "data":{
          "first": {
              "value":`已配送至${delivery.pickup_spot}`,
              "color":"#173177"
          },
          "keyword1":{
              "value":delivery._id,
              "color":"#173177"
          },
          "keyword2": {
              "value":`集运(取件码：${delivery.pickup_code})`,
              "color":"#173177"
          },
          "remark":{
              "value":`商品已经配送至自提点啦，请您今天方便的时间记得取一下哈☺️。因为商品在自提点无法过夜，如有特殊情况无法今天取件，请及时联系我们～`,
              "color":"#173177"
          }
        }
    };

      console.log(admin_config)
      let response = null
      // if(!delivery.is_pickupTimeSelector_sent){
        await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, admin_config);
        response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, config);
      // }
      
      console.log(response)

    // response = await db.collection("delivery").doc(delivery._id).update({
    //   data:{
    //     is_pickupTimeSelector_sent:true,
    //     state:"待选择取货时间",
    //     times:tiktea_hotpot_yimu_times
    //   }
    // })
      if(response.data.errcode==0){
        console.log("delivery_id ",delivery._id," 成功发送模板消息")

        //TODO: 记录消息推送时间。
        // response = await db.collection("delivery").doc(delivery._id).update({
        //   data:{
        //     is_pickupTimeSelector_sent:true,
        //     /*state:"待选择取货时间",
        //     times:tiktea_times*/
        //   }
        // })
        // if(response.stats.updated !=1){
        //   console.log("delivery_id ",delivery._id," is_quote_message_sent 更新失败")
        // }
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

    // let delivery_array = 
    //     // 1)delivery_array
    //     // 2)录入取货码至数据库
    //     // 3）修改取货时间
    // [
    //   "bf4a0bf2620c92eb0f21bd4c56826c19",
    //   "bf4a0bf2621768a3113269aa3dc97381"
    // ]
    let delivery_array = 
        // 1)delivery_array
        // 2)录入取货码至数据库
        // 3）修改取货时间
    [
      "41ae62ef622d58a90bfa538c698d6971",
      "617ef50c623099640bc0f5b11d765aa1",
      "d4107ab16231d39e000831100e46fca4",
      "d4107ab16231dd7d000a1a473b9f9339",
      "d4107ab1623458b9006b7d20119b1e1b",
    ]
    // ["54ad1eea61e526ff07cb08e41ec84011"]
    
    // let deliveries = await db.collection("delivery").where({
    //   tracking_number:_.or([_.eq("EB760818992CN"),_.eq("EB761250880CN")])
    // }).get();

    /* 填充取件码 */ 
    // for(let delivery of deliveries.data){
    //   let code = delivery.packages[0].pickup_code
    //   if(delivery.pickup_code=="待到达"){
    //     let response = await db.collection("delivery").doc(delivery._id).update({
    //       data:{
    //         pickup_code:code
    //       }
    //     })
    //     if(response.stats.updated !=1){
    //       console.log("delivery_id ",delivery._id," pickup_code 更新失败")
    //     }
    //   }
    // }

    // let deliveries = await db.collection("delivery").where({
    //     _id: _.in(delivery_array)
    //   }).get()

    // let object = {}
    // object["17e3426e61d8745603c841c66e57ff67"]="admin"//ADMIN

    // object["617ef50c6227857d0a70b6f171844332"]="G23"
 		

    // delivery_array =Object.keys(object)
    // for (let delivery of delivery_array){
    //   response = await db.collection("delivery").doc(delivery).update({
    //     data:{
    //       state:"待选择取货时间",
    //       pickup_code:object[delivery]
    //     }
    //   })
    // }
    // console.log(delivery_array)
    let deliveries = await db.collection("delivery").where({
        _id: _.in(delivery_array)
      }).get()
    
    // let deliveries = await db.collection("delivery").where({
    //   state:"待选择取货时间"
    // }).get()
    deliveries = deliveries.data
    for(let delivery of deliveries){
      await sendMessage(token,delivery)
    }
  }catch(e){
    console.log(e)
  }
}