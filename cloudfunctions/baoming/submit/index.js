const cloud = require('wx-server-sdk');
const request = require("request-promise");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
const log = cloud.logger()
exports.main = async (event, context) => {
  try {
    const wxContext = await cloud.getWXContext();
    /*let user = await db.collection('user')
    .where({
      miniprogram_open_id: _.eq(wxContext.OPENID)
    })
    .get();
    // console.log(user);*/


    /*if(user.data.length == 0){
      await db.collection('user').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          miniprogram_open_id: wxContext.OPENID,
          union_id: wxContext.UNIONID,
          official_account_open_id: null
        }
      });
    }*/

    let response = await db.collection('baoming').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        open_id: wxContext.OPENID,
        union_id: wxContext.UNIONID,
        added_date: new Date(),
        name: event.name,
        name_kana: event.name_kana,
        phone: event.phone,
        xingbie: event.xingbie,
        size: event.size
      }
    });
    // log.info({
    //   add_response:add_response
    // })
    return {
      success: true,
      data: response
    }
    // return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: false,
      data: 'create collection failed'
    };
  }
}