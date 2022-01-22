const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  let product_response = await db.collection('products').doc(event.product_id).get();
  delivery = await db.collection('public').doc("287a53aa61adee4100ba68a821f0aae3").get();
  return {data:product_response.data,delivery:delivery.data.product_delivery}
};
