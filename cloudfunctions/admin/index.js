

const updateUser = require('./updateUser/index');
const getAccessToken = require('./getAccessToken/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'updateUser':
      return await updateUser.main(event, context);
      case 'getAccessToken':
        return await getAccessToken.main(event, context);
    default:
        console.log("switch语法的index.js也需要增量上传。");
  }
};