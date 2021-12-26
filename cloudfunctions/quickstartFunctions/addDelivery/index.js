const cloud = require('wx-server-sdk');
const request = require("request-promise");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {
    try {
        const wxContext = await cloud.getWXContext();
        let user = await db.collection('user')
        .where({
          miniprogram_open_id: _.eq(wxContext.OPENID)
        })
        .get();
        // console.log(user);
        // const log = cloud.logger()
        // log.info({
        //   user:user
        // })
        if(user.data.length == 0){
          await db.collection('user').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              miniprogram_open_id: wxContext.OPENID,
              union_id: wxContext.UNIONID,
              official_account_open_id: null
            }
          });
        }

        let data_array = [];
        for(tracking_number of event.tracking_numbers){
            data_array.push({
                tracking_number:tracking_number,
                weight:null
            });
        }
        
        await db.collection('delivery').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              open_id: wxContext.OPENID,
              union_id: wxContext.UNIONID,
              added_date: new Date(),
              pickup_spot:event.pick_up_spot,
              packages:data_array,
              phone:event.phone,
              state:"待打包称重",//待打包称重，待报价，待支付，待发货，运输中，已到达
              is_quote_message_sent:false,
              is_pickup_message_sent:false,

              tracking_number:"待发货",
              pickup_code:"待发货",
              total_weight:"待称重",
              amount_to_pay:"待称重"
              // payment_id

            }
          });
          
          let response = await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();

          var resData = {
            "msgtype": "text",
            "text": {
                "content": "有客户下单啦~",
            }
           };

           let group_resp = await request({
            url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(resData)
          });

          console.log(group_resp);

          // let new_promise = new Promise((resolve, reject) => {
          //   try {
          //     request({
          //       method: 'POST',
          //       headers: {
          //         "content-type": "application/json",
          //       },
          //       body: JSON.stringify(resData),
          //       url:  "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
          //     }, function (error, response, body) {
          //       if (error) {
          //         return reject(error);
          //       }
          //       return resolve(JSON.parse(body));
          //     })
          //   } catch (e) {
          //     return reject(e)
          //   }
          // });

          // await new_promise;

          return {
            success: true,
            official_account_url:response.data.enter_official_account
          }
        // return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
    }catch (e) {
        // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
        return {
          success: false,
          data: 'create collection failed'
        };
      }
}
