import cloud from 'wx-server-sdk';
import { getDBCollection, IProduct, IPublic } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
export async function main(event: { product_id: string }, context: any) {
	// 返回数据库查询结果
	const product_response = await getDBCollection<IProduct>(db, 'products').doc(event.product_id).get();
	const delivery = await getDBCollection<IPublic>(db, 'public').doc("287a53aa61adee4100ba68a821f0aae3").get();
	return { data: product_response.data, delivery: delivery.data.product_delivery }
};
