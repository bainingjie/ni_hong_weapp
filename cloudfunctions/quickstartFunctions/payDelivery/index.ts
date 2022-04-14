import cloud from 'wx-server-sdk';
import { IPayment } from '../../../miniprogram/pages/getDelivery/Delivery';
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
function randomString(len: number): string {
	const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
	let res = "";
	for (let i = 0; i < len; i++)
		res += t.charAt(Math.floor(Math.random() * t.length));
	return res;
}
export async function main(event: { delivery_id: string, amount_to_pay: string }, context: any) {
	console.assert("delivery_id" in event);
	console.assert("amount_to_pay" in event);
	try {
		const response = <IPayment>await db.collection('payment').add({
			// data 字段表示需新增的 JSON 数据
			data: {
				type: 0,
				delivery_id: event.delivery_id,
				is_paid: false,
				totalFee: event.amount_to_pay
			}
		});

		console.assert(response._id !== undefined);
		if (response._id === undefined)
			throw new TypeError();

		const res = await cloud.cloudPay.unifiedOrder({
			body: "霓虹町指南-集运运费",
			outTradeNo: response._id.toString(),
			spbillCreateIp: "127.0.0.1",
			subMchId: "1614594513", //商户号
			totalFee: parseInt(event.amount_to_pay) * 100,
			envId: "testbai-6gjgkia55f6d4918",
			functionName: "payDeliveryCallback",
			nonceStr: randomString(32),
			tradeType: "JSAPI"
		});
		console.log(`unified order res=${JSON.stringify(res)}`);
		return res;
	} catch (e) {
		console.log(e);
	}
}