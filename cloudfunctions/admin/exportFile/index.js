
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
  // let deliveries = await db.collection("delivery").where({
  //   state:_.or(["待发货","待支付"])
  // }).get();

  let weight_file = await cloud.downloadFile({
    fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/sent.csv'
  })
  const res = parse(weight_file.fileContent)
  console.log(res)
  res.shift();
  let weight_objects=[]
  for (row of res){
    weight_objects.push(row[0]);
  }
  console.log(weight_objects)

  let deliveries = await db.collection("delivery").where({
    // state:"待发货"
  }).get();
  // let deliveries = await db.collection("delivery").where({
  //   state:"待支付"
  // }).get();
  let data = []
  console.log(deliveries)
  for (let delivery of deliveries.data){
    for(let package of delivery.packages){
      let sent = false
      if(weight_objects.includes(package.tracking_number)){
        sent=true
      }
      let content = ""
      if("content" in package){
        content=package.content
      }
      data.push({
        state:delivery.state,
        delivery_id:delivery._id,
        tracking_number:package.tracking_number,
        weight:package.weight,
        user_union_id:delivery.union_id,
        pickup_spot:delivery.pickup_spot,
        international_tracking_number:delivery.tracking_number,
        content:content,
        sent:sent
      })
    }
  }
  const csvData = stringify(data, { header: true });
  // fs.writeFileSync("./sample.csv", csvData);
  await cloud.uploadFile({
    cloudPath: 'export.csv',
    fileContent: csvData,
  })

  // const fileStream = fs.createReadStream(path.join(__dirname, 'demo.jpg'))
  // return await cloud.uploadFile({
  //   cloudPath: 'demo.jpg',
  //   fileContent: fileStream,
  // })
}
