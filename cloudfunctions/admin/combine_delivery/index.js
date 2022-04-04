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

      /* add packages to delivery*/
      // let tar="d4107ab16235fea700a2203f20a4743d"
      // let target = await db.collection("delivery").doc(tar).get() 

      // let new_packages = target.data.packages
      // packages=[
      //   {tracking_number:"YT6387549623300",content:"配饰"},
      //   {tracking_number:"75864963238141",content:"衣服"},
      //   {tracking_number:"75864850485921",content:"衣服"},
      //   {tracking_number:"YT6383367420999",content:"配饰"},
      //   {tracking_number:"75864828547280",content:"配饰"},
      //   {tracking_number:"75866602557627",content:"配饰"},
      //   {tracking_number:"SF1351591478914",content:"零食"},
      //   {tracking_number:"75864855483248",content:"衣服"},
      //   {tracking_number:"75864847619568",content:"配饰"},
      // ]
      // for(let package of packages){
      //   new_packages.push(package)
      // }
      // response = await db.collection("delivery").doc(tar).update({
      //   data:{
      //     packages:new_packages
      //   }
      // })
      // console.log(packages)


          let packages = [
    "807102f66244ecbd02f099a241135642",
    "efbc6d7162455c88031d15ed1d39cfed",
    "efbc6d716245c69d03350ae974615dd1",
    "807102f66241454302526dd9537c4da8",
    "d4107ab16247b4960422a46232d44102",
    "63605076623e83fe01ba26eb21552a93",
    "82afc00a623e9f480162dd6048158863",
    "82afc00a623fde39017cd46a17edeba8",
    "d4107ab162438cb002ef54f930963895",
    "efbc6d716241100b02513a11517d6b6a"]
    for(let package of packages){
      response = await db.collection("delivery").doc(package).update({
        data:{
          remark:"因为上海疫情的封闭管理，原计划4/2(周六)寄出的货物，统一安排4/6(周三)优先加急寄出。抱歉给您添麻烦了。"
        }
      })
    }

        /* update international tracking number*/
      // let package = ["617ef50c6220975009867e0350b1dbd5",
      //   "54ad1eea62209a3f1414f0aa4ea378ca",
      //   "54ad1eea62209f331415e4ef2f2186ab",
      //   "41ae62ef6220a0ad0a2a06b21e890045",
      //   "17e3426e6220a21011b1f44e61091a52",
      //   "bf4a0bf26221f15312bc98105ad638ec",
      //   "5b049cc86222ebd20f5336a83ef139f2",
      //   "54ad1eea62233f1b146f84ad1b3159e3",
      //   "5b049cc8622446780f6e57aa4834b04f",
      //   "17e3426e6224749512194df93c859797",
      //   "bf4a0bf26225c1191330e7391b11bcc4",
      //   "54ad1eea6225fa7f14ccf44a540ba8c3",
      //   "41ae62ef622621b20af06aab3da29472",
      //   "bf4a0bf26226be7a1350903809e332d2",
      //   "17e3426e6226c05a1260421e5f69ce0f",
      //   "5b049cc862273b0d0fbc4df33dfbd990",
      //   "617ef50c6227857d0a70b6f171844332",
      //   "41ae62ef6227f3550b3029736b7fc0aa",
      //   "617ef50c62285d2d0a8bfcc96d52adad",
      //   "54ad1eea6229821f154da91b3946eba7",
      //   "bf4a0bf26229e64b13c4bc5757ac6933"]
        
      //   let response = await db.collection("delivery").where({
      //     _id:_.in(package)
      // }).update({
      //   data:{
      //     state:"运输中",
      //     tracking_number:"EB762122771CN"
      //   }
      // }) 

      // let to_add_1 = await db.collection("delivery").doc("82afc00a62370531007dcec96d6873e5").get() 
      // let tar="807102f66239be5b01221e453a9a5156"
      // // let to_add_2 = await db.collection("delivery").doc("41ae62ef6228534d0b420d046685c961").get() 
      // let target = await db.collection("delivery").doc(tar).get() 
      // let packages = to_add_1.data.packages
      // let new_packages = target.data.packages
      // for(let package of packages){
      //   new_packages.push(package)
      // }
      // packages = to_add_2.data.packages
      // for(let package of packages){
      //   new_packages.push(package)
      // }

    // response = await db.collection("delivery").doc(tar).update({
    //   data:{
    //     packages:new_packages
    //   }
    // })
    // console.log(packages)


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