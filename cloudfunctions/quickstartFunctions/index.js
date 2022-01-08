const getPublicData = require('./getPublicData/index');
const addDelivery = require('./addDelivery/index');
const payDelivery = require('./payDelivery/index');
const getPickUpSpot = require('./getPickUpSpot/index');
const getPickUpSpots = require('./getPickUpSpots/index');
const getDelivery = require('./getDelivery/index');
const getADelivery = require('./getADelivery/index');
const getProduct = require('./getProduct/index');
const selectPickupTime = require('./selectPickupTime/index')
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
    case "selectPickupTime":
      return await selectPickupTime.main(event, context);
    default:
        console.log("switch语法的index.js也需要增量上传。");
  }
};
