const cloud = require('wx-server-sdk');
const excel = require('node-xlsx');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const max = 100;
exports.main = async (event, context) => {
  try {
    const count = await db.collection("baoming").count();
    const data_num = count.total;
    const select_num = Math.ceil(data_num / 100);
    const select_result = [];
    for (let i = 0; i < select_num; i++) {
      const out = db.collection("baoming").skip(i * max).limit(max).get();
      select_result.push(out);
    }
    return {
      success: true,
      data: select_result
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