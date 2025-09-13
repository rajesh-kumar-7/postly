const jwt= require('jsonwebtoken');
function isAuthenticated(req,res,next){
    let token=req.cookies.token;
    if(!token){
        res.redirect('/');
    }
    if(token){
       let data =  jwt.verify(token,"rjtrixsecret");
       req.user = data;
       next();
    }
}
module.exports = isAuthenticated;