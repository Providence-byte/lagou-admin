const {Users} = require('../utils/db');

const findUser = (username)=>{
    return Users.findOne({username})
}

const signup = ({username,password})=>{
    const users = new Users({
        username,
        password
    })
    //save返回一个pending状态的promise，是一个异步函数
    return users.save();
}

 const findList = ()=>{
     return Users.find().sort({_id:-1});
 }

 const remove = (id)=>{
    //各种坑，各种不推荐。。。。
     return Users.deleteOne({_id:id});
 }

exports.signup = signup;
exports.findUser = findUser;
exports.findList = findList;
exports.remove = remove;