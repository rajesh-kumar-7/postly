const express = require('express');
const isAuthenticated = require('./middleware/isAuthenticated');
const app = express();
const path = require('path');
const usermodel = require('./models/usermodel');
const postModel = require('./models/postmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require("./upload");
const cookieparser=require('cookie-parser');
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("views","./views");
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,'public')));
app.get("/",(req,res)=>{
    res.render("login");
})
app.post('/register',(req,res)=>{
    let{username,email,password}=req.body;
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
    let createduser = await usermodel.create({
        username,
        email,
        password:hash
    })
    let token = jwt.sign({email,id:createduser._id},'rjtrixsecret');
    res.cookie("token",token);
    res.redirect('/home');
    });
    
});   
})
app.post('/signin', async (req,res)=>{
    let user = await usermodel.findOne({email:req.body.email});
    if(!user){
       return  res.send(`
              <script>
              alert("invalid username or password");
              window.history.back();
              </script>`)

    }
    if(user){
        bcrypt.compare(req.body.password, user.password,function(err, result) {
          if(result){
            let token = jwt.sign({email:user.email,id:user._id},'rjtrixsecret');
            res.cookie("token",token);
            res.redirect('/home');
          }
          if(!result){
            res.send(`
              <script>
              alert("invalid username or password");
              window.history.back();
              </script>`)
          }
});
    }
})
app.get('/home',isAuthenticated,async (req,res)=>{
  let post= await postModel.find().populate("user").sort({time:-1});
  res.render("home",{ post, user:req.user});
 
});
app.post('/createpost',isAuthenticated, upload.single('image'),async (req,res)=>{
  let {content}=req.body;
 
  let post = await postModel.create({
    content,
    user:req.user.id,
    image:req.file
    ? {data:req.file.buffer,
    contentType:req.file.mimetype}
    : null
  })
  res.redirect('/home');
})
app.get('/posts/:id/image', async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    if (post && post.image && post.image.data) {
      res.set('Content-Type', post.image.contentType);
      return res.send(post.image.data);
    }
    res.status(404).send('No image found');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/logout',(req,res)=>{
  res.cookie("token","");
res.redirect('/');
})
app.get('/register',(req,res)=>{
  res.render("register");
})
app.post('/delete/:id',isAuthenticated,async (req,res)=>{
  let post = await postModel.findById(req.params.id);
  if(post.user.toString()== req.user.id){
   await postModel.findByIdAndDelete(post._id);
    res.redirect('/home');
  }
  else{
     res.send(`
      <script>
      alert("only owner can delete the post");
      window.history.back();
      </script>`);
    
  }


})

app.listen(3000,()=>{
console.log("http://localhost:3000");
})