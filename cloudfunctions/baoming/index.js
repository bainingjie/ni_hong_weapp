const submit = require('./submit/index');
const admin_excel = require('./admin_excel/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'submit':
      return await submit.main(event, context);
    case 'admin_excel':
      return await admin_excel.main(event, context);
    default:
      console.log("switch语法的index.js也需要增量上传。");
  }
};