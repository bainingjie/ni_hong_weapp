// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const {parse} = require('csv-parse/sync');
const _ = db.command;

exports.main = async (event, context) => {
  try{
    let weight_file = await cloud.downloadFile({
      fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/weight.csv'
    })
    const res = parse(weight_file.fileContent)
    let weight_object={}
    res.shift();
    let stock=[]
    
    for (row of res){
        let weight = Number(row[9]);
        stock.push(row[0])
        weight_object[row[0]]=weight
    }
    let deliveries = await db.collection("delivery").where({
      state: _.not(_.eq("已配送")),
    }).get()
    deliveries = deliveries.data

    let applied = []
    for (let delivery of deliveries){
      for(let package of delivery.packages){
            applied.push(package.tracking_number)
      }
    }
    console.log(stock)
    console.log(applied)
    for (let item of stock){
        if(!applied.includes(item)){
            console.log(item,weight_object[item])
        }
    }
    

    return {
      state:"success"
    }
  }catch(e){
    console.log(e)
    return {
      state:"error"
    }
  }
}