import * as cloud from 'wx-server-sdk';
import { IPickupSpot } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
export async function main(event: {type: 'getPickUpSpots'}, context: any){
  // 返回数据库查询结果
  return await db.collection<IPickupSpot>('pickup_spots').get();
}