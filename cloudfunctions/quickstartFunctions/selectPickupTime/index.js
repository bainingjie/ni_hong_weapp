const cloud = require('wx-server-sdk');
const request = require("request-promise");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const log = cloud.logger()
exports.main = async (event, context) => {
    try {
      let delivery_response = await db.collection('delivery').doc(event.id).get();
      let resData = {};
      if("pickup_date" in delivery_response.data){
        let text = `有顾客修改了取货时间~\ndelivery_id:${event.id}\n修改前：${delivery_response.data.pickup_date} ${delivery_response.data.pickup_time} \n修改后：${event.date} ${event.time} \n取货地点：${delivery_response.data.pickup_spot} \n取货码： ${delivery_response.data.pickup_code} \n`;
        resData = {
          "msgtype": "text",
          "text": {
              "content": text,
          }
         };

      }else{
        resData = {
          "msgtype": "text",
          "text": {
              "content": `有顾客选择了取货时间~\ndelivery_id:${event.id}\n取货时间：${event.date} ${event.time} \n取货地点：${delivery_response.data.pickup_spot} \n取货码： ${delivery_response.data.pickup_code} \n`,
          }
         };

      }

      await db.collection('delivery').doc(event.id).update({
          data:{
              state:"待配送至自提点",
              pickup_date:event.date,
              pickup_time:event.time
          }
      })

        await request({
          url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
          method: "POST",
          headers: {
              "content-type": "application/json",
          },
          body: JSON.stringify(resData)
        });

        return {
          success: true,
        }
    }catch (e) {
        log.error({
          error: e
        })
        return {
          success: false,
          data: 'failed to update pickup time'
        };
      }
}