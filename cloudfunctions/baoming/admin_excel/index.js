const cloud = require('wx-server-sdk');
const excel = require('node-xlsx');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
//单次读取100条上限
const max = 100;
exports.main = async (event, context) => {
  try {
    console.log(event)
    //查询数据数量
    const count = await db.collection("baoming").where({ activity_id: event.activity_id }).count();
    console.log(count)
    const data_num = count.total;
    const select_result = [];
    if (data_num > max) {//若数据总量大于查询上限，循环读取
      const select_num = Math.ceil(data_num / 100);
      for (let i = 0; i < select_num; i++) {
        const out = await db.collection("baoming").where({ activity_id: event.activity_id }).skip(i * max).limit(max).get();
        select_result.push(out);
      }
    } else {
      const out = await db.collection("baoming").where({ activity_id: event.activity_id }).limit(max).get();
      select_result.push(out);
    }
    let json_data = select_result[0].data;
    let biaotou = ["ID"];
    //循环读取数据，添加表头
    for (let i of json_data[0].template.questions) {
      biaotou.push(i.title);
    }
    biaotou.push("付款凭证截图超链接");
    let excel_data = [];
    excel_data.push(biaotou);
    console.log(json_data)
    console.log(biaotou)
    let hang = [];
    let row_count = 1;
    for (let x of json_data) {
      hang.push(row_count)
      for (let y of x.template.questions) {
        let element = y.answer;
        if (element == null) {
          element = "";
        }
        hang.push(element)
      }
      let url =""
      if ("receipt_url" in x) {
        for(let item of x.receipt_url){
          url += item
          url += " , "
        }
      }
      hang.push(url);
      excel_data.push(hang);
      hang = [];
      row_count++;
    }
    let tmp = await excel.build([{ name: "data", data: excel_data }]);
    let cloud_path = await cloud.uploadFile({ cloudPath: "data.xlsx", fileContent: tmp });
    return {
      success: true,
      data: cloud_path
    }

    /*return (await Promise.all(select_result)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })*/

    // return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: false,
      data: 'create collection failed'
    };
  }
}