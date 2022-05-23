import * as cloud from 'wx-server-sdk';
import { getDBCollection, IDelivery } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
export async function main(event: {type:'getDelivery'}, context: any) {
  const wxContext = cloud.getWXContext();
  // 返回数据库查询结果
  return await getDBCollection<IDelivery>(db, 'delivery').where({
    open_id: wxContext.OPENID
    // open_id: "123"
  }).orderBy('added_date','desc').get();
}