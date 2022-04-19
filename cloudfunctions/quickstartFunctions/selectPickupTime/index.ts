import cloud from 'wx-server-sdk';
import request from "request-promise";
import { getDBCollection, IDelivery } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const log = cloud.logger()
export async function main(event: { id: string, date: string, time: string }, context: any): Promise<{ success: true } | { success: false, data: "failed to update pickup time" }> {
	try {
		const delivery_response = await getDBCollection<IDelivery>(db, 'delivery').doc(event.id).get();
		let resData = { msgtype: "", text: { content: "" } };
		if ("pickup_date" in delivery_response.data) {
			const text = `有顾客修改了取货时间~\ndelivery_id:${event.id}\n修改前：${delivery_response.data.pickup_date} ${delivery_response.data.pickup_time} \n修改后：${event.date} ${event.time} \n取货地点：${delivery_response.data.pickup_spot} \n取货码： ${delivery_response.data.pickup_code} \n`;

			resData.msgtype = "text";
			resData.text.content = text;

		} else {
			resData.msgtype = "text";
			resData.text.content = `有顾客选择了取货时间~\ndelivery_id:${event.id}\n取货时间：${event.date} ${event.time} \n取货地点：${delivery_response.data.pickup_spot} \n取货码： ${delivery_response.data.pickup_code} \n`;
		}

		await getDBCollection<IDelivery>(db, 'delivery').doc(event.id).update({
			data: {
				state: "待配送至自提点",
				pickup_date: event.date,
				pickup_time: event.time
			}
		})

		await request({
			url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(resData)
		});

		return {
			success: true,
		}
	} catch (e) {
		log.error({
			error: e
		})
		return {
			success: false,
			data: "failed to update pickup time"
		};
	}
}