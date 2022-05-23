import * as cloud from 'wx-server-sdk';
import { getDBCollection, ICoupon, ICouponUser, IDelivery } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
export async function main(event: { open_id: string;type: 'getCouponForUser'}, context: any) {
	// 返回数据库查询结果
	console.assert('open_id' in event);
	console.assert(typeof event.open_id === 'string');
	if (typeof event.open_id !== 'string')
		throw new Error(`event.open_id must be a string, but received a ${typeof event.open_id}. (event = ${JSON.stringify(event)}!`);

	const qq = await getDBCollection<ICouponUser>(db, 'coupon_user').where({
		open_id: event.open_id,
		state: "未使用"
		// open_id: "123"
	}).get();

	let coupons = new Array<[ICouponUser,ICoupon]>();
	const now = (new Date()).getTime();
	for (let e of qq.data) {
		if(e.available_until.getTime()<now){
			await getDBCollection<ICouponUser>(db, 'coupon_user').doc(e._id!).update({
				data:{
					state:"已过期"
				}
			});
			continue;
		};
		const temp = await getDBCollection<ICoupon>(db, 'coupon').doc(e.coupon_id).get();
		coupons.push([e,temp.data]);

	}
	return coupons;
};