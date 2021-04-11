const { hash, compare, sign, verify } = require('../utils/tools');
//用户权限的设置：必须登录后才能访问部分功能
const auth = (req,res,next)=>{
    let token = req.get('X-Access-Token');
    try {
        let result = verify(token);
        next();
    } catch (error) {
        res.render('fail', {
            data: JSON.stringify({
                message: '用户登录过期'
            })
        })
    }
}

exports.auth = auth;