const usersModel = require("../models/users");
const { hash } = require('../utils/tools');

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
    }else{
        res.render('fail', {
            data: JSON.stringify({
                message: '用户不存在'
            })
        })
    }
}


exports.signup = signup;
exports.list = list;
exports.remove = remove;