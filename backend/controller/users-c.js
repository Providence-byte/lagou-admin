const usersModel = require("../models/users");
const { hash, compare } = require('../utils/tools');
// const randomstring = require("randomstring");


//注册用户
const signup = async (req, res, next) => {
    res.set("content-type", "application/json;charset=UTF-8");
    const { username, password } = req.body;
    const hashPassword = await hash(password)

    //判断用户是否存在
    const findResult = await usersModel.findUser(username);

    if (findResult) {
        res.render('fail', {
            data: JSON.stringify({
                message: '用户名已存在'
            })
        });
    } else {
        //数据库中没有该用户
        await usersModel.signup({
            username,
            password: hashPassword
        });


        res.render('success', {
            data: JSON.stringify({
                message: '注册成功'
            })
        })
    }

}
//用户登录
const signin = async (req, res, next) => {
    const { username, password } = req.body;
    let result = await usersModel.findUser(username);
    //验证用户是否是合法用户（存在数据库中）
    if (result) {
        let { password: hashPwd } = result
        let compareResult = await compare(password, hashPwd);
        if (compareResult) {
            //模拟session
            //生成随机字符串
            // const sessionId = randomstring.generate();
            //种cookie
            // res.set('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly`)

            //用工具帮我们做session
            req.session.username = username;
            
            res.render('success', {
                data: JSON.stringify({
                    message: '登录成功'
                })
            })
            
        } else {
            res.render('fail', {
                data: JSON.stringify({
                    message: '用户名或密码输入错误'
                })
            })
        }
    } else {
        res.render('fail', {
            data: JSON.stringify({
                message: '用户名或密码输入错误'
            })
        })
    }


}
//用户退出登录
const signout = async (req,res,next) => {
    req.session = null;
    res.render('success', {
        data: JSON.stringify({
            message: '成功退出登录'
        })
    })
}
//用户列表
const list = async (req, res) => {
    res.set("content-type", "application/json;charset=UTF-8");
    const listResult = await usersModel.findList();
    res.render('success', {
        data: JSON.stringify(
            listResult         //这个结果本身就是对象，不用加花括号
        )
    })

}
//删除列表
const remove = async (req, res, next) => {
    const { id } = req.body;
    let result = await usersModel.remove(id);
    if (result) {
        res.render('success', {
            data: JSON.stringify({
                message: '用户已删除'
            })
        })
    } else {
        res.render('fail', {
            data: JSON.stringify({
                message: '用户不存在'
            })
        })
    }
}
//验证权限
const isAuth = async (req,res,next) => {
    if(req.session.username){
        res.render('success', {
            data: JSON.stringify({
                message: '通过验证'
            })
        })
    }else{
        res.render('fail', {
            data: JSON.stringify({
                message: '用户登录过期'
            })
        })
    }
}

exports.signup = signup;
exports.list = list;
exports.remove = remove;
exports.signin = signin;
exports.signout = signout;
exports.isAuth = isAuth;