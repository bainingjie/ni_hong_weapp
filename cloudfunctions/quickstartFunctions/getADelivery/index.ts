import cloud from 'wx-server-sdk';
import { IDelivery } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
export async function main (event:DB.IDocumentData, context: any){
  // 返回数据库查询结果
  console.assert('_id' in event);
  return await db.collection<IDelivery>('delivery').where({
    _id:event._id
    // open_id: "123"
  }).get();
};