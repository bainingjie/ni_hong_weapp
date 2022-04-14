import cloud from 'wx-server-sdk';
import { IPublic } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
export async function main(event: any, context: any) {
  // 返回数据库查询结果
  return await db.collection<IPublic>('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
};
