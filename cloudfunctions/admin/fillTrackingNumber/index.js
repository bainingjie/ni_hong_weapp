// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const {parse} = require('csv-parse/sync');

// const parser = require('csv-parse/lib/sync');
/*　get access token。can be used multiple time before it expires. */ 

exports.main = async (event, context) => {
  /* number fileID row[N]:*/ 
  let number = "EB759597891CN" 
  try{
    let delivery_file = await cloud.downloadFile({
        fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/1_15.csv'
      })
    const res = parse(delivery_file.fileContent)
    res.shift();
    let ids =[]
    // console.log(res)
    for (row of res){
        // console.log(row[0])
        ids.push(row[1]);
    }
    for(let item of ids){
      // console.log(item)
      let response = await db.collection('delivery').where({
        'packages.tracking_number':item
      }).get();

      if(response.data.length>0){
        // console.log(response)
        let packages = response.data[0].packages
        let index = packages.findIndex(x => x.tracking_number === item);
        packages[index].international_tracking_number = number
        // console.log(packages)
        await db.collection('delivery').doc(response.data[0]._id).update({
          data:{
            packages:packages
          }
        })
      }else{
        console.log(item,number," application not found")
      }
  }

    // let ids =["bf4a0bf261c9645100c9645e5d376fb9","bf4a0bf261c9651300c99bf15e627e90","17e3426e61cd15f70177844838fe056f","bf4a0bf261cddcb4019834e156067def","17e3426e61cc2d7e01532ad2257357b9","17e3426e61cd4b4a018301040407a5ef","17e3426e61d0202d020893e66fcfbce9"]

    // for (id of ids){
    //     let delivery = await db.collection("delivery").doc(id).get()
    //     if(delivery.state="待发货"){
    //         console.log(id)
    //         let response = await db.collection("delivery").doc(id).update(
    //             {
    //                 data:{
    //                     state:"运输中",
    //                     tracking_number:number,
    //                     pickup_code:"待签收"
    //                 }
    //             })
    //         console.log(response)
    //     }
    // }
    

  }catch(e){
    console.log(e)
  }
}