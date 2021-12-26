// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const axios = require('axios');
const db = cloud.database();
async function getOpenIDs(ACCESS_TOKEN,next_openid){
    try{
        // console.log("next_openid",next_openid)
        let response = await axios.get('https://api.weixin.qq.com/cgi-bin/user/get', {
            params: {
                access_token: ACCESS_TOKEN,
                next_openid:next_openid
            }
          });
        //   console.log(response)
        return response.data
    }catch(e){
        console.log(e)
        return 1
    }
}

async function getUnionIDs(ACCESS_TOKEN,config){
    try{
        let response = await axios.post(`https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=${ACCESS_TOKEN}`, config);
        // console.log(response.data)
        return response.data.user_info_list
    }catch(e){
        console.log(e)
        return 1
    }
}

// 云函数入口函数
exports.main = async (event, context) => {
    let res = await db.collection("public").doc("c0ca0aed61c3d73301ffd88d515bcb72").get();
    let token = res.data.accessToken
    let openids = await getOpenIDs(token,"");
    // console.log(openids)

    // let next_openid = openids.next_openid;
    openids = openids.data.openid;
    
    let config = { user_list:[]};
    let res2 = await db.collection("official_account_user").get()
    let old_ids = []
    for (let usr of res2.data){
        old_ids.push(usr.openid)
    }
    console.log(old_ids)
    console.log(openids)
    for (let id of openids){
        if (!(old_ids.includes(id))){
            config.user_list.push({
                openid:id
            });
        }
    }
    // console.log("config",config);
    if(config.user_list==0){
        console.log("没有更多关注者啦");
        return 0;
    }
    let user_info_list = await getUnionIDs(token,config);
    // console.log(user_info_list)
    let count = 0;
    for (user of user_info_list){
        await db.collection('official_account_user').add({
            data: {
                headimgurl:user.headimgurl,
                nickname:user.nickname,
                openid:user.openid,
                unionid:user.unionid
            }
        })
        count += 1;
    }
    console.log(count," users are added");
    // await db.collection('public').doc("c0ca0aed61c3d73301ffd88d515bcb72")
    // .update({
    //   data: {
    //     next_openid:next_openid
    //   }
    // });
    return {
        state:"done"
    }
}
