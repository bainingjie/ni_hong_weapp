import * as cloud from 'wx-server-sdk';
import { getDBCollection, ICoupon, ICouponUser, IDelivery } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
export async function main(event: { open_id: string;[key: string]: any }, context: any) {
	// 返回数据库查询结果
	console.assert('open_id' in event);
	console.assert(event.open_id !== undefined);
	if (event.open_id === undefined) throw new Error("event.open_id can't be undefined!");

	const qq = await getDBCollection<ICouponUser>(db, 'coupon_user').where({
		open_id: event.open_id,
		state: "未使用"
		// open_id: "123"
	}).get();

	let coupons = new Array<ICoupon>();
	for (let e of qq.data) {
		const temp = await getDBCollection<ICoupon>(db, 'coupon').where({
			_id: e.coupon_id
		}).get();
		console.assert(temp.data.length === 1);
		coupons.push(...temp.data);

	}
	return coupons;
};