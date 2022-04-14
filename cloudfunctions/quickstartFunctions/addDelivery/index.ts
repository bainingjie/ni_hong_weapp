import * as cloud from 'wx-server-sdk';
import request from "request-promise";
import { IDelivery, IPackage, IPublic, IUser } from '../../../miniprogram/pages/getDelivery/Delivery';

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const log = cloud.logger();



export async function main(
	event: {
		shipping_details: Array<IPackage>,
		pickup_spot: string,
		phone: string,
		[key:string]: any
	},
	context: any): Promise<
	{ success: true, official_account_url: string } |
	{ success: false, data: 'create collection failed' , msg:string, e: any}> {
	try {
		const wxContext = cloud.getWXContext();
		const user_db = db.collection<IUser>('user');
		let user = await user_db
			.where({
				miniprogram_open_id: _.eq(wxContext.OPENID)
			})
			.get();
		// console.log(user);
		console.assert(typeof user === 'object');

		if (user.data.length === 0) {
			await user_db.add({
				// data 字段表示需新增的 JSON 数据
				data: {
					// _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
					miniprogram_open_id: wxContext.OPENID,
					union_id: wxContext.UNIONID,
					official_account_open_id: null
				}
			});
		}

		// let data_array: IPackage[] = [];
		for (let detail of event.shipping_details) {
			console.assert(typeof detail === 'object');
			console.assert(typeof detail.tracking_number === 'string');
			console.assert(typeof detail.content === 'string');
			console.assert(typeof detail.note === 'string');
		}
		// 	// if (typeof detail === 'string') {
		// 	// 	data_array.push({
		// 	// 		tracking_number: detail,
		// 	// 		weight: null
		// 	// 	});
		// 	// } else {
		// 	data_array.push({
		// 		...detail,
		// 		weight: null
		// 	});
		// 	// }
		// }
		let data: IDelivery = {
			type: 0, //0是集运，1是商城交易 
			open_id: wxContext.OPENID,
			union_id: wxContext.UNIONID,
			added_date: new Date(),
			pickup_spot: event.pickup_spot,
			packages: event.shipping_details,
			phone: event.phone,
			state: "待打包称重" as const,//待打包称重，待报价，待支付，待发货，运输中，已到达
			is_quote_message_sent: false,
			is_pickup_message_sent: false,
			is_pickup_remind_sent: false,

			tracking_number: "待发货",
			pickup_code: "待到达",
			total_weight: "待称重",
			amount_to_pay: "待称重",
			remark: ""

		}

		const add_response = await db.collection<IDelivery>('delivery').add({
			// data 字段表示需新增的 JSON 数据
			data: {
				...data
				// _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
				// payment_id

			}
		});

		if (add_response === undefined || typeof add_response === 'string')
			throw new TypeError(`add_response=${add_response}`);

		const response = await db.collection<IPublic>('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
		// log.info({
		//   add_response:add_response
		// })
		const resData = {
			"msgtype": "text",
			"text": {
				"content": `有客户申请了集运\ndelivery_id:${add_response._id}`,
			}
		};

		let group_resp = await request({
			url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(resData)
		});

		console.log(group_resp);

		// let new_promise = new Promise((resolve, reject) => {
		//   try {
		//     request({
		//       method: 'POST',
		//       headers: {
		//         "content-type": "application/json",
		//       },
		//       body: JSON.stringify(resData),
		//       url:  "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
		//     }, function (error, response, body) {
		//       if (error) {
		//         return reject(error);
		//       }
		//       return resolve(JSON.parse(body));
		//     })
		//   } catch (e) {
		//     return reject(e)
		//   }
		// });

		// await new_promise;

		return {
			success: true,
			official_account_url: response.data.enter_official_account
		}
		// return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
	} catch (e) {
		// 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
		return {
			success: false,
			data: 'create collection failed',
			msg: "wtf?",
			e: e
		};
	}
}
