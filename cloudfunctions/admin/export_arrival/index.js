
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
    let delivery = await db.collection("delivery").where({
        /*'packages.international_tracking_number':_.or([_.eq("EB760495872CN"),_.eq("EB760807045CN"),_.eq("EB760494510CN"),_.eq("EB760807045CN")])*/
        'packages.international_tracking_number':"EB760495872CN"
    }).get()
    deliveries = delivery.data
    let data = []
    for (let delivery of deliveries){
      for(let package of delivery.packages){
        data.push({
          state:delivery.state,
          delivery_id:delivery._id,
          tracking_number:package.tracking_number,
          weight:package.weight,
          content:package.content,
          note:package.note,
          package_pickup_code:("pickup_code" in package)?package.pickup_code:"", 
          international_tracking_number:package.international_tracking_number,
          pickup_spot:delivery.pickup_spot,
          pickup_code:delivery.pickup_code,
          pickup_date:("pickup_date" in delivery)?delivery.pickup_date:"", 
          pickup_time:("pickup_time" in delivery)?delivery.pickup_time:""
        })
      }
    }
    const csvData = stringify(data, { header: true });
    // fs.writeFileSync("./sample.csv", csvData);
    await cloud.uploadFile({
      cloudPath: 'arrival/EB760495872CN.csv',
      fileContent: csvData,
    })
}