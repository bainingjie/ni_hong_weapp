// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
// const {parse} = require('csv-parse');
const {parse} = require('csv-parse/sync');
const _ = db.command;

// const parser = require('csv-parse/lib/sync');
/*　get access token。can be used multiple time before it expires. */ 

exports.main = async (event, context) => {
  try{
    let weight_file = await cloud.downloadFile({
      fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/活动模板.csv'
    })
    const res = parse(weight_file.fileContent)
    let file = []
    let row_max=-1
    let col_max=0
    for (row of res){
        col_max=row.length
        file.push(row)
        row_max+=1
    }
    console.log("size",row_max,col_max)
    let object ={}
    object.title=file[1][0]
    object.subtitle=file[1][1]
    object.period=file[1][2]
    description=""
    for(let i = 1;i<=row_max;i++){
        if(file[i][3]){
            console.log(file[i][3])
            description += file[i][3]
            description += "&hc"
        }else{
            break
        }
    }
    object.description = description
    object.template=file[1][4]
    let contents = []
    for(let i = 5;i<=col_max;i=i+2){
        let content ={}
        if(!file[3][i]){
            break
        }
        content.title = file[3][i]
        content.title_red=file[1][i]=="否"?false:true
        content.content_red=file[1][i+1]=="否"?false:true
        content.content=""
        for(let j = 3;j<=row_max;j++){
            if(file[j][i+1]){
                content.content += file[j][i+1]
                content.content += "&hc"
            }else{
                break
            }
        }
        contents.push(content)
    }    
    object.contents = contents
    object.added_date = new Date()
    object.is_active = true
    console.log(object)
    await db.collection("baoming_activity").add({
        data:object
    })
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