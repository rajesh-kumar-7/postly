const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
          content: String,
          user : {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
          },
           image: {
    data: Buffer,          
    contentType: String  },
     
          time:{
            type:Date,
            default:Date.now
          }

})
const postModel = mongoose.model('post',postSchema);
module.exports= postModel;