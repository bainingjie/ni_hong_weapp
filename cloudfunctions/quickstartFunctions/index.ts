// 云函数入口函数
import * as getPublicData from './getPublicData/index';
import * as addDelivery from './addDelivery/index';
import * as payDelivery from './payDelivery/index';
import * as getPickUpSpot from './getPickUpSpot/index';
import * as getPickUpSpots from './getPickUpSpots/index';
import * as getDelivery from './getDelivery/index';
const CloudFunctionEventTypes = {
	getPublicData: require('./getPublicData/index'),
	addDelivery: require('./addDelivery/index'),
	payDelivery: require('./payDelivery/index'),
	getPickUpSpot: require('./getPickUpSpot/index'),
	getPickUpSpots: require('./getPickUpSpots/index'),
	getDelivery: require('./getDelivery/index'),
	getADelivery: require('./getADelivery/index'),
	getProduct: require('./getProduct/index'),
	getProducts: require('./getProducts/index'),
	selectPickupTime: require('./selectPickupTime/index'),
	payTrade: require('./payTrade/index'),
	addPhone: require('./addPhone/index')
} as const;


type CloudFunctionEventTypes = keyof typeof CloudFunctionEventTypes;

export async function main(event: { type: CloudFunctionEventTypes }, context:any){
	console.log(event.type);
	if (event.type in CloudFunctionEventTypes) {
		return await CloudFunctionEventTypes[event.type].main(event, context);
	} else {
		console.log("switch语法的index.js也需要增量上传。");
	}
}
// export async function CloudFunctionCall()
