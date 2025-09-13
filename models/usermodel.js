const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://rjtrix123:rjtrix%40123@cluster0.nlmdwb1.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0");
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:');
});
const userschema = new mongoose.Schema({
    username : String,
    email : String,
    password:String,
    post:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"post"
    }]

})
const usermodel = mongoose.model('user',userschema);
module.exports = usermodel;
