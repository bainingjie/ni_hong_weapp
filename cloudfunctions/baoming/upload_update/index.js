const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
const log = cloud.logger();
exports.main = async (event, context) => {
  try {
    const fileList = [event.url]
    const result = await cloud.getTempFileURL({
      fileList: fileList
    })
    let real_url = result.fileList[0].tempFileURL;
    let response = await db.collection('baoming').doc(event.id).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        is_receipt_uploaded: true,
        receipt_url: real_url
      }
    });
    return {
      success: true,
      data: response
    }
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: false,
      data: "失败！"
    };
  }
}