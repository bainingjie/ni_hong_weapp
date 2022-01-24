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
    log.info({
      event:event
    })
    let response = await db.collection('baoming').doc(event.baoming_id).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        template:event.template,
        last_revised_date: new Date()
      }
    });
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