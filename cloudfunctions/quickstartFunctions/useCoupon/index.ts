import * as cloud from 'wx-server-sdk';
import { getDBCollection, ICouponUser, IPayment, IProduct } from '../../../miniprogram/pages/getDelivery/Delivery';
import { randomString } from '../../../miniprogram/my_library/index';
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
export async function main(event: { type: 'useCoupon', coupon_users: ICouponUser[], payment_id: cloud.DB.DocumentId}, context: any) {
	const d = getDBCollection<ICouponUser>(db, "coupon_user");
	for (const cu of event.coupon_users) {
		if(cu._id === undefined) throw new Error();
		await d.doc(cu._id).update({
			data: {
				state: "已使用",
				payment_id: event.payment_id
			}
		})
	}
}