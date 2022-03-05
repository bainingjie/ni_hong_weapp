const cloud = require('wx-server-sdk');
const request = require("request-promise");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
const log = cloud.logger()
exports.main = async (event, context) => {
    try {

        /* update international tracking number*/
        let response = await db.collection("delivery").where({
            state:"运输中",
            tracking_number:"待发货"
        }).update({
          data:{
            tracking_number:"EB761790686CN"
          }
        }) 
        



      /*
      // let to_add_1 = await db.collection("delivery").doc("41ae62ef6215cf5108641b93047b5e5c").get() 

      let tar="bf4a0bf2621ae4fc11a488f4785c256d"
      let to_add_2 = await db.collection("delivery").doc("617ef50c621d654108ff94507ba84705").get() 
      let target = await db.collection("delivery").doc(tar).get() 
      let packages = to_add_2.data.packages
      let new_packages = target.data.packages
      for(let package of packages){
        new_packages.push(package)
      }
      // packages = to_add_2.data.packages
      // for(let package of packages){
      //   new_packages.push(package)
      // }

    response = await db.collection("delivery").doc(tar).update({
      data:{
        packages:new_packages
      }
    })
    console.log(packages)
    */

    /*   */ 
  //  let find = await db.collection('delivery')
  //  .where({
  //    'packages.tracking_number':"YT2204288696220"
  //  })
  //  .get()
 
  //  let new_p = find.data[0]
  //  delete new_p._id;
  //  console.log(new_p)
  //  response = await db.collection("delivery").add({
  //   data: new_p
  // })
    }catch(e){
      console.log(e)
    }
}