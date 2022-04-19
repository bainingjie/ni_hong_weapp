// 云函数入口函数
import * as addDelivery from './addDelivery/index';
import * as addPhone from './addPhone/index';
import * as getADelivery from './getADelivery/index';
import * as getCouponForUser from './getCouponForUser/index';
import * as getDelivery from './getDelivery/index';
import * as getPickUpSpot from './getPickUpSpot/index';
import * as getPickUpSpots from './getPickUpSpots/index';
import * as getProduct from './getProduct/index';
import * as getProducts from './getProducts/index';
import * as getPublicData from './getPublicData/index';
import * as payDelivery from './payDelivery/index';
import * as payTrade from './payTrade/index';
import * as selectPickupTime from './selectPickupTime/index';

// const CloudFunctionEventTypes = [
// 	'addDelivery',
// 	'addPhone',
// 	'getADelivery',
// 	'getCouponForUser',
// 	'getDelivery',
// 	'getPickUpSpot',
// 	'getPickUpSpots',
// 	'getProduct',
// 	'getProducts',
// 	'getPublicData',
// 	'payDelivery',
// 	'payTrade',	
// 	'selectPickupTime',
// ] as const;
const CloudFunctionEventTypes = {
	addDelivery: addDelivery.main,
	addPhone: addPhone.main,
	getADelivery: getADelivery.main,
	getCouponForUser: getCouponForUser.main,
	getDelivery: getDelivery.main,
	getPickUpSpot: getPickUpSpot.main,
	getPickUpSpots: getPickUpSpots.main,
	getProduct: getProduct.main,
	getProducts: getProducts.main,
	getPublicData: getPublicData.main,
	payDelivery: payDelivery.main,
	payTrade: payTrade.main,
	selectPickupTime: selectPickupTime.main
} as const;

type QuickstartFunctionType =  {typeof CloudFunctionEventTypes[k in keyof typeof CloudFunctionEventTypes]:k};

type CloudFunctionEventTypes = keyof typeof CloudFunctionEventTypes;

export async function main(event: { type?: CloudFunctionEventTypes, [k:string]:any}, context: any) {
	console.assert(typeof event.type === 'string');
	console.debug(`event.type = ${JSON.stringify(event.type)}`);
	
	switch (event.type) {
		case 'addDelivery':
			return await addDelivery.main(event as any,context);
		case 'addPhone':
			return await addPhone.main(event as Exclude<typeof event,'type'>, context);
		case 'getADelivery':
			return await getADelivery.main(event, context);
		case 'getCouponForUser':
			return await getCouponForUser.main(event, context);
		case 'getDelivery':
			return await getDelivery.main(event, context);
		case 'getPickUpSpot':
			return await getPickUpSpot.main(event, context);
		case 'getPickUpSpots':
			return await getPickUpSpots.main(event, context);
		case 'getProduct':
			return await getProduct.main(event, context);
		case 'getProducts':
			return await getProducts.main(event, context);
		case 'getPublicData':
			return await getPublicData.main(event, context);
		case 'payDelivery':
			return await payDelivery.main(event, context);
		case 'payTrade':
			return await payTrade.main(event, context);
		case 'selectPickupTime':
			return await selectPickupTime.main(event, context);
		default:
			throw new Error("switch语法的index.js也需要增量上传。");
	}
}
// export async function CloudFunctionCall()
