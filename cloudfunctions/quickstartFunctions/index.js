const getPublicData = require('./getPublicData/index');
const addDelivery = require('./addDelivery/index');
const payDelivery = require('./payDelivery/index');
const getPickUpSpot = require('./getPickUpSpot/index');
const getPickUpSpots = require('./getPickUpSpots/index');
const getDelivery = require('./getDelivery/index');
const getADelivery = require('./getADelivery/index');
const getProduct = require('./getProduct/index');
const getProducts = require('./getProducts/index');
const selectPickupTime = require('./selectPickupTime/index')
const payTrade = require('./payTrade/index');
const addPhone = require('./addPhone/index');
const getPickupTime =  require('./getPickupTime/index');
const getPickupTime2 =  require('./getPickupTime2/index');
const getPickupCode =  require('./getPickupCode/index');
const deliveredMessage =  require('./deliveredMessage/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getPublicData':
      return await getPublicData.main(event, context);
    case 'addDelivery':
      return await addDelivery.main(event, context);
    case 'payDelivery':
      return await payDelivery.main(event, context);
    case 'getPickUpSpot':
      return await getPickUpSpot.main(event, context);
    case 'getPickUpSpots':
      return await getPickUpSpots.main(event, context);
    case 'getDelivery':
      return await getDelivery.main(event, context);
    case 'getADelivery':
      return await getADelivery.main(event, context);
    case 'getProduct':
      return await getProduct.main(event, context);
    case 'getProducts':
      return await getProducts.main(event, context);
    case "selectPickupTime":
      return await selectPickupTime.main(event, context);
    case 'payTrade':
      return await payTrade.main(event, context);
    case 'addPhone':
      return await addPhone.main(event, context);
    case 'getPickupCode':
      return await getPickupCode.main(event, context);
    case 'getPickupTime':
      return await getPickupTime.main(event, context);
    case 'getPickupTime2':
      return await getPickupTime2.main(event, context);
    case 'deliveredMessage':
      return await deliveredMessage.main(event, context);
    default:
      console.log("switch语法的index.js也需要增量上传。");
  }
};
