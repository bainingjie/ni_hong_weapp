const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // todo：更新取件时间
  console.log(new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }))
  // return await db.collection('delivery').where({
  //   _id:event._id
  //   // open_id: "123"
  // }).get();

  // todo：返回数据
};