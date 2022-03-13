const updateUser = require('./updateUser/index');
const getAccessToken = require('./getAccessToken/index');
const fillWeight = require('./fillWeight/index');
const fillTrackingNumber = require('./fillTrackingNumber/index');
const sendMessage = require('./sendMessage/index');
const exportFile = require('./exportFile/index');
const export_arrival = require('./export_arrival/index');
const selectPickupTime = require('./selectPickupTime/index');
const findOrphans = require('./findOrphans/index');
const add_packages = require('./add_packages/index');
const combine_delivery = require('./combine_delivery/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'updateUser':
      return await updateUser.main(event, context);
    case 'getAccessToken':
      return await getAccessToken.main(event, context);
    case 'fillWeight':
      return await fillWeight.main(event, context); 
    case 'fillTrackingNumber':
      return await fillTrackingNumber.main(event, context); 
    case 'sendMessage':
      return await sendMessage.main(event, context);   
    case 'exportFile':
      return await exportFile.main(event,context);
    case "export_arrival":
      return await export_arrival.main(event,context);
    case "selectPickupTime":
      return await selectPickupTime.main(event,context);
    case "findOrphans":
      return await findOrphans.main(event,context);
    case "add_packages":
      return await add_packages.main(event,context);
    case "combine_delivery":
      return await combine_delivery.main(event,context);
    default:
        console.log("switch语法的index.js也需要增量上传。");
  }
};