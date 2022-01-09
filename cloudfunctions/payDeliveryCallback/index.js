// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require("request-promise");

cloud.init()

const db = cloud.database();          
const log = cloud.logger()
const _ = db.command

exports.main = async (event, context) => {
    // console.log(event);
    const {
      returnCode, // 状态码
      outTradeNo,
      transactionId,
      feeType,//货币
      mchId,
      openid,
      userInfo
    } = event;
   try{
    if(returnCode == "SUCCESS"){
        await db.collection('payment').doc(outTradeNo)
        .update({
          data: {
            is_paid:true,
            returnCode,
            transactionId,
            feeType,
            mchId,
            openid,
            userInfo
          }
        }) 
        //todo : 判断 return值确认update成功
        let response = await db.collection('payment').doc(outTradeNo).get();


        if(response.data.type==0){
          /*集运的订单*/
          await db.collection('delivery').doc(response.data.delivery_id)
          .update({
            data: {
              state: "待发货",
              payment_id:outTradeNo
            }
          }) 
        }else if(response.data.type==1){
           /*商城的订单*/



          //ADD USER if doesn`t exist
          let user = await db.collection('user')
          .where({
            miniprogram_open_id: _.eq(response.data.miniprogram_open_id)
          })
          .get();



          if(user.data.length == 0){
            await db.collection('user').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                miniprogram_open_id: response.data.miniprogram_open_id,
                union_id: response.data.union_id
              }
            });
          }

          //ADD DELLIVERY
          let find_delivery = await db.collection('delivery').where({
            payment_id:_.eq(outTradeNo),
          }).get();

          if(find_delivery.data.length==0){
            let product_response = await db.collection("products").doc(response.data.product_id).get();
            let delivery_response = await db.collection('delivery').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                type:1, //0是集运，1是商城交易 
                open_id: response.data.miniprogram_open_id,
                union_id: response.data.union_id,
                added_date: new Date(),
                pickup_spot:response.data.pick_up_spot,
                
                phone:"",
                state:"待发货",
                is_pickup_message_sent:false,
                is_pickup_remind_sent:false,
  
                payment_id:outTradeNo,
                product_id:response.data.product_id,
                sku_index:response.data.sku_index,

                product_name:product_response.data.name,
                sku_name:product_response.data.sku[response.data.sku_index].name

  
                // is international?
                // chinese_tracking_number,
                // international_tracking_number,
  
              }
            });

            //notify 
            var resData = {
              "msgtype": "text",
              "text": {
                  "content": "有客户在商城下单啦~",
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
  

          }
        }

        return { errcode: 0 };// 向微信后台返回成功，否则微信后台将会重复调用此函数
    }
    return { errcode: 1 };
   }catch(e){
     log.error({
      error: e,
    })
    return { errcode: 1 };
   }
  };