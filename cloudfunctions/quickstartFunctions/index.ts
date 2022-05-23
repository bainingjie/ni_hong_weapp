// 云函数入口函数
import * as addDelivery from './addDelivery/index';
import * as addPhone from './addPhone/index';
import * as doNothing from './doNothing/index';
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


const CloudFunctionEventTypes = [
	'addDelivery',
	'addPhone',
	'doNothing',
	'getADelivery',
	'getCouponForUser',
	'getDelivery',
	'getPickUpSpot',
	'getPickUpSpots',
	'getProduct',
	'getProducts',
	'getPublicData',
	'payDelivery',
	'payTrade',	
	'selectPickupTime',
] as const;
// const CloudFunctionEventTypes = {
// 	addDelivery: addDelivery.main,
// 	addPhone: addPhone.main,
// 	getADelivery: getADelivery.main,
// 	getCouponForUser: getCouponForUser.main,
// 	getDelivery: getDelivery.main,
// 	getPickUpSpot: getPickUpSpot.main,
// 	getPickUpSpots: getPickUpSpots.main,
// 	getProduct: getProduct.main,
// 	getProducts: getProducts.main,
// 	getPublicData: getPublicData.main,
// 	payDelivery: payDelivery.main,
// 	payTrade: payTrade.main,
// 	selectPickupTime: selectPickupTime.main
// } as const;

// type QuickstartFunctionType =  {typeof CloudFunctionEventTypes[k in keyof typeof CloudFunctionEventTypes]:k};

type CloudFunctionEventTypes = typeof CloudFunctionEventTypes[number];

export async function main(event: {type: CloudFunctionEventTypes}, context: any) {
	
	console.assert(typeof event.type === 'string');
	
	switch (event.type) {
		case 'addDelivery':
			return await addDelivery.main(event as any,context);
		case 'addPhone':
			return await addPhone.main(event as any, context);
		case 'doNothing':
			return await doNothing.main(event as any, context);
		case 'getADelivery':
			return await getADelivery.main(event as any, context);
		case 'getCouponForUser':
			return await getCouponForUser.main(event as any, context);
		case 'getDelivery':
			return await getDelivery.main(event as any, context);
		case 'getPickUpSpot':
			return await getPickUpSpot.main(event as any, context);
		case 'getPickUpSpots':
			return await getPickUpSpots.main(event as any, context);
		case 'getProduct':
			return await getProduct.main(event as any, context);
		case 'getProducts':
			return await getProducts.main(event as any, context);
		case 'getPublicData':
			return await getPublicData.main(event as any, context);
		case 'payDelivery':
			return await payDelivery.main(event as any, context);
		case 'payTrade':
			return await payTrade.main(event as any, context);
		case 'selectPickupTime':
			return await selectPickupTime.main(event as any, context);
		default:
			throw new Error("switch语法的index.js也需要增量上传。");
	}
}
// export async function CloudFunctionCall()
