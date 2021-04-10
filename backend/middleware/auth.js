//用户权限的设置：必须登录后才能访问部分功能
const auth = (req,res,next)=>{
    if(req.session.username){
        next();
    }else{
        res.render('fail', {
            data: JSON.stringify({
                message: '用户登录过期'
            })
        })
    }
}

exports.auth = auth;