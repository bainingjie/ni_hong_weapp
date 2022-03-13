
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
const {stringify} = require("csv-stringify/sync");
const {parse} = require('csv-parse/sync');
const db = cloud.database();
// const {parse} = require('csv-parse/sync');
const _ = db.command
cloud.init()

exports.main = async (event, context) => {
  
  /*
  let weight_file = await cloud.downloadFile({
    fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/weight.csv'
  })
  let res = parse(weight_file.fileContent)
  let record = []
  for (let row of res){
    record.push(row[0])
  }
  console.log(record)

  weight_file = await cloud.downloadFile({
    fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/anning_weight.csv'
  })
  res = parse(weight_file.fileContent)
  let anning_record = []
  for (let row of res){
    anning_record.push(row[0])
  }
  console.log(anning_record)
  */

  // let deliveries = await db.collection("delivery").where({
  //   state:_.or(["待发货","待支付"])
  // }).get();

  // let weight_file = await cloud.downloadFile({
  //   fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/sent.csv'
  // })
  // const res = parse(weight_file.fileContent)
  // console.log(res)
  // res.shift();
  // let weight_objects=[]
  // for (row of res){
  //   weight_objects.push(row[0]);
  // }
  // console.log(weight_objects)

  // let deliveries = await db.collection("delivery").where({
  //   state: _.and(_.neq("已配送"),_.neq("运输中"))
  // }).get();
  // console.log(deliveries)

  // let deliveries = await db.collection("delivery").get();

  let deliveries = await db.collection("delivery").where({
    state: _.neq("已配送")
  }).get();
  // console.log(deliveries)

  
  let data = []
  let count = 0
  console.log(deliveries)
  for (let delivery of deliveries.data){
      // data.push({
      //   state:delivery.state,
      //   delivery_id:delivery._id,
      //   tracking_number:delivery.tracking_number,
      //   real_total_weight:delivery.real_total_weight,
      //   amount_to_pay:delivery.amount_to_pay
      // })
    count += 1
    // data.push({
    //   count: "C"+count.toString(),
    //   state:delivery.state,
    //   delivery_id:delivery._id,
    //   pickup_spot:delivery.pickup_spot,
    //   pickup_code:delivery.pickup_code,
    //   amount:delivery.amount_to_pay,

    // })
    // let changsha = 0
    for(let package of delivery.packages){
      // if (record.includes(package.tracking_number)){
      //   changsha = 0
      // }else if(anning_record.includes(package.tracking_number)){
      //   changsha = 1
      // }else{
      //   changsha = 2
      // }
      data.push({
        count: "E"+count.toString(),
        state:delivery.state,
        delivery_id:delivery._id,
        tracking_number:package.tracking_number,
        weight:package.weight,
        content:package.content,
        note:package.note,
        /*place:changsha,*/
        package_pickup_code:("pickup_code" in package)?package.pickup_code:"", 
        package_remark:("remark" in package)?package.remark:"", 
        international_tracking_number:package.international_tracking_number,
        pickup_spot:delivery.pickup_spot,
        pickup_code:delivery.pickup_code,
        amount:delivery.amount_to_pay,
        real_total_weight:delivery.real_total_weight,
        delivery_tracking_number:delivery.tracking_number,
        remark:("remark" in delivery)?delivery.remark:"", 
        pickup_date:("pickup_date" in delivery)?delivery.pickup_date:"", 
        pickup_time:("pickup_time" in delivery)?delivery.pickup_time:"",
        payment_id:("payment_id" in delivery)?"":"not paid",
      })
      // let content = ""
      // if("content" in package){
      //   content=package.content
      // }
      // data.push({
      //   state:delivery.state,
      //   delivery_id:delivery._id,
      //   tracking_number:package.tracking_number,
      //   weight:package.weight,
      //   user_union_id:delivery.union_id,
      //   pickup_spot:delivery.pickup_spot,
      //   international_tracking_number:delivery.tracking_number,
      //   content:content,
      //   sent:sent
      // })
    }
  }
  const csvData = stringify(data, { header: true });
  // fs.writeFileSync("./sample.csv", csvData);
  await cloud.uploadFile({
    cloudPath: 'export_3_12.csv',
    fileContent: csvData,
  })

  // const fileStream = fs.createReadStream(path.join(__dirname, 'demo.jpg'))
  // return await cloud.uploadFile({
  //   cloudPath: 'demo.jpg',
  //   fileContent: fileStream,
  // })
}

// exports.main = async (event, context) => {
//   let response = await db.collection('delivery')
//   .where({
//     'packages.international_tracking_number':"EB759914625CN"
//   })
//   .get()
//   console.log(response)
//   let data = []
//   for (let delivery of response.data){
//     for(let package of delivery.packages){
//       if(package.international_tracking_number=="EB759914625CN"){
//         data.push({
//           state:delivery.state,
//           delivery_id:delivery._id,
//           tracking_number:package.tracking_number,
//           weight:package.weight,
//           user_union_id:delivery.union_id,
//           pickup_spot:delivery.pickup_spot,
//           international_tracking_number:delivery.tracking_number,
//         })
//       }
//     }
//   }
//   const csvData = stringify(data, { header: true });
//   // fs.writeFileSync("./sample.csv", csvData);
//   await cloud.uploadFile({
//     cloudPath: 'EB759914625CN.csv',
//     fileContent: csvData,
//   })

// }