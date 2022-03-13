const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // todo: 更新取件时间
  // let tokyo_time = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
  // tokyo_time = new Date(tokyo_time)
  // tokyo_time.getDay()

  let delivery = await db.collection('delivery').where({
    _id:event._id
  }).get();

  //todo: check 是否包邮到家
  let pickup_spot = await db.collection('pickup_spots').where({
    name:delivery.data[0].pickup_spot
  }).get();

  return {
    delivery:delivery.data[0],
    time_object:pickup_spot.data[0]
  }
};