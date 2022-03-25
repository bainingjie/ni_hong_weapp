const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  const wxContext = await cloud.getWXContext();
  return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
};
