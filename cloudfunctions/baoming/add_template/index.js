// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const {parse} = require('csv-parse');
// const {parse} = require('csv-parse/sync');
const _ = db.command;

// const parser = require('csv-parse/lib/sync');
/*　get access token。can be used multiple time before it expires. */ 

exports.main = async (event, context) => {
  try{
    let weight_file = await cloud.downloadFile({
      fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/报名信息模板.csv'
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
    object.title=file[0][1]

    let questions = []
    for(let i = 1;i<=col_max;i++){
        let question = {}
        if(!file[2][i]){
            break
        }
        question.answer=""
        question.is_necessary = file[2][i]=="否"?false:true
        question.type=file[3][i]
        question.title=file[4][i]
        question.subtitle=file[5][i]
        choices = []
        for(let j = 6;j<=row_max;j++){
            if(file[j][i]){
                choices.push(file[j][i])
            }else{
                break
            }
        }
        question.choices=choices
        questions.push(question)
    }    
    object.questions = questions
    object.added_date = new Date()
    object.is_active = true
    console.log(object)
    await db.collection("baoming_form_template").add({
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