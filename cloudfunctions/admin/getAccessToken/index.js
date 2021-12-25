// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const axios = require('axios');
const db = cloud.database();
/*　get access token。can be used multiple time before it expires. */ 

async function getAccessToken(){
    try{
        let response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
            params: {
                grant_type: 'client_credential',
                appid: 'wx24ce7c8334f12720',
                secret: '00c7df2d3717ef39370829c4b69f0dd3',
            }
          });
        // console.log(response)
        return response.data.access_token
    }catch(e){
        console.log(e)
        return 1
    }
}
exports.main = async (event, context) => {
    let token = await getAccessToken();
    let resp = await db.collection('public').doc("c0ca0aed61c3d73301ffd88d515bcb72")
    .update({
      data: {
        accessToken:token,
        added_date:new Date()
      }
    });
    console.log(resp)
    return {
        state:"done"
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
    }
}