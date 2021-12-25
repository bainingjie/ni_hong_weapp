const updateUser = require('./updateUser/index');
const getAccessToken = require('./getAccessToken/index');
const fillWeight = require('./fillWeight/index');
const sendMessage = require('./sendMessage/index');
const exportFile = require('./exportFile/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'updateUser':
      return await updateUser.main(event, context);
    case 'getAccessToken':
      return await getAccessToken.main(event, context);
    case 'fillWeight':
      return await fillWeight.main(event, context); 
    case 'sendMessage':
      return await sendMessage.main(event, context);   
    case 'exportFile':
      return await exportFile.main(event,context);
    default:
        console.log("switch语法的index.js也需要增量上传。");
  }
};