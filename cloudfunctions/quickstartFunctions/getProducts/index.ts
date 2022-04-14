import cloud from 'wx-server-sdk';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event: any, context: any) => {
  // 返回数据库查询结果
  return await db.collection('products').orderBy('view','desc').get();
};