// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

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
    /*
      开发者自己的逻辑
    */
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
        // console.log(response)
        await db.collection('delivery').doc(response.data.delivery_id)
        .update({
          data: {
            state: "待发货",
            payment_id:outTradeNo
          }
        }) 
        return { errcode: 0 };// 向微信后台返回成功，否则微信后台将会重复调用此函数
    }
    return { errcode: 1 };
   }catch(e){
    return { errcode: 1 };
   }
  };