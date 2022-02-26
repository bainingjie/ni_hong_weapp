const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
const log = cloud.logger();
exports.main = async (event, context) => {
  try {
    log.info({
      event:event
    })
    const fileList = [event.url]
    const result = await cloud.getTempFileURL({
      fileList: fileList
    })
    let real_url = result.fileList[0].tempFileURL;

    let baoming = await db.collection('baoming').doc(event.id).get()
    log.info({
      baoming:baoming
    })
    let file_array = []
    if("receipt_url" in baoming.data){
      log.info({
        receipt_url:true
      })
      file_array=baoming.data.receipt_url
      file_array.push(real_url)
    }else{
      file_array.push(real_url)
    }

    let response = await db.collection('baoming').doc(event.id).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        is_receipt_uploaded: true,
        receipt_url: file_array
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