const submit = require('./submit/index');
const getBaomings = require('./getBaomings/index');
const getABaoming = require('./getABaoming/index');
const updateBaoming = require('./updateBaoming/index');
const getActivities = require('./getActivities/index');
const admin_excel = require('./admin_excel/index');
const add_activity = require('./add_activity/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'submit':
      return await submit.main(event, context);

    case 'getBaomings':
      return await getBaomings.main(event, context);
    case 'getABaoming':
      return await getABaoming.main(event, context);
    case 'updateBaoming':
      return await updateBaoming.main(event, context);
    case "getActivities":
      return await getActivities.main(event,context);
    case 'admin_excel':
      return await admin_excel.main(event, context);
    case 'add_activity':
      return await add_activity.main(event, context);
    default:
      console.log("switch语法的index.js也需要增量上传。");
  }
};