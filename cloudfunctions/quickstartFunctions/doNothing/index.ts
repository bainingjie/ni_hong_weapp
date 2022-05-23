import * as cloud from 'wx-server-sdk';
import { getDBCollection, ICoupon, ICouponUser, IDelivery } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
export async function main(event: { type: 'doNothing'}, context: any) {
	throw new Error("NotImplementedError");

}