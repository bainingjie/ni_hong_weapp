

const cloud = require('wx-server-sdk');
const request = require("request-promise");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
const log = cloud.logger()


// 获取活动信息
// 已报名数据（此次活动）/已报名表单（以前的活动）/新表单
exports.main = async (event, context) => {
    try {
        let response = await db.collection('baoming_activity').doc(event.id).get()
        log.info({response:response})
        let template = await db.collection('baoming_form_template').where({
            title:response.data.template
        }).get()
        log.info({template:template})
        // return {
        //     success: true,
        //     activity: response.data,
        //     template:template.data[0]
        // }
        const wxContext = await cloud.getWXContext();
        let found_activity = await db.collection('baoming').where({
            open_id: wxContext.FROM_OPENID,
            activity_id:event.id
        }).get();
        let found_template = await db.collection('baoming').where({
            open_id: wxContext.FROM_OPENID,
            "template.title" :response.data.template
        }).get();
        return {
            success: true,
            activity: response.data,
            template:template.data[0],
            found_activity:found_activity,
            found_template:found_template
        }

    } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    log.info({error:e})
    return {
        success: false,
        data: 'create collection failed'
    };
    }
}