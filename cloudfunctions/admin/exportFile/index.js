
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
const {stringify} = require("csv-stringify/sync");
const db = cloud.database();
// const {parse} = require('csv-parse/sync');

cloud.init()

exports.main = async (event, context) => {
  let deliveries = await db.collection("delivery").where({
    state:"待发货"
  }).get();
  let data = []
  console.log(deliveries)
  for (let delivery of deliveries.data){
    for(let package of delivery.packages){
      data.push({
        delivery_id:delivery._id,
        tracking_number:package.tracking_number,
        weight:package.weight,
        user_union_id:delivery.union_id,
        pickup_spot:delivery.pickup_spot,
      })
    }
  }
  const csvData = stringify(data, { header: true });
  // fs.writeFileSync("./sample.csv", csvData);
  await cloud.uploadFile({
    cloudPath: 'test.csv',
    fileContent: csvData,
  })

  // const fileStream = fs.createReadStream(path.join(__dirname, 'demo.jpg'))
  // return await cloud.uploadFile({
  //   cloudPath: 'demo.jpg',
  //   fileContent: fileStream,
  // })
}
