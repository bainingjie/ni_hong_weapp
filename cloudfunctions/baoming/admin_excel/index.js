const cloud = require('wx-server-sdk');
const excel = require('node-xlsx');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const max = 100;
exports.main = async (event, context) => {
  try {
    const count = await db.collection("baoming").count();
    const data_num = count.total;
    const select_result = [];
    if (data_num > max) {
      const select_num = Math.ceil(data_num / 100);
      for (let i = 0; i < select_num; i++) {
        const out = await db.collection("baoming").skip(i * max).limit(max).get();
        select_result.push(out);
      }
    } else {
      const out = await db.collection("baoming").limit(max).get();
      select_result.push(out);
    }
    let json_data = select_result[0].data;
    let biaotou = [];
    for (let i in json_data[0]) {
      biaotou.push(i);
    }
    let excel_data = [];
    excel_data.push(biaotou);
    let hang = [];
    for (let x in json_data) {
      for (let y in biaotou) {
        let element = json_data[x][biaotou[y]];
        if (element == null) {
          element = "";
        }
        hang.push(element)
      }
      excel_data.push(hang);
      hang = [];
    }
    let tmp = await excel.build([{ name: "data", data: excel_data }]);
    let cloud_path = await cloud.uploadFile({ cloudPath: "data.xlsx", fileContent: tmp });

    /*return (await Promise.all(select_result)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })*/
    return {
      success: true,
      data: cloud_path
    }
    // return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: false,
      data: 'create collection failed'
    };
  }
}