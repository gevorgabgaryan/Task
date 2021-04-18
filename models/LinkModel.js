const {model, Schema}=require('mongoose');

const LinkSchema=new Schema({
     
            link:{
                type:String,
                unique:true                   
            },
            statusCode:{
                type:String,                      
            },
            domain:{
                type:String,                      
            },
         
    },{
        timestamps:true
    })

 let LinkModel=model('Link',LinkSchema)

 module.exports={
     LinkModel
 }