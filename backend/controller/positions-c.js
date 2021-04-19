const positionsModel = require('../models/positions');
const moment = require('moment');

const addPositions = async (req, res, next) => {
    res.set("content-type", "application/json;charset=UTF-8");
    let result = await positionsModel.addPositions({
        ...req.body,
        companyLogo:req.companyLogo,
        createTime: moment().format('MM月DD日')
    });
    if (result) {
        res.render('success', {
            data: JSON.stringify({
                message: '添加成功'
            })
        })
    } else {
        res.render('fail', {
            data: JSON.stringify({
                message: '添加失败'
            })
        })

    }
}

const list = async (req,res,next)=>{
    const result = await positionsModel.list()  
    if (result) {
       res.json(result);
    } else {
        res.render('fail', {
            data: JSON.stringify({
                message: '获取数据失败'
            })
        })

    }
}

const removePositions = async (req,res,next)=>{
    const { id } = req.body;
    let result = await positionsModel.removePositions(id);
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

const updatePositions = async (req,res,next)=>{
    res.set("content-type", "application/json;charset=UTF-8");

    const data = {
        ...req.body,
    }
    if(req.companyLogo){
        data['companyLogo'] = req.companyLogo;
    }
    let result = await positionsModel.updatePositions(
        data
    );
    if (result) {
        res.render('success', {
            data: JSON.stringify({
                message: '修改成功'
            })
        })
    } else {
        res.render('fail', {
            data: JSON.stringify({
                message: '修改失败'
            })
        })

    }
}

const listOne = async (req,res,next)=>{
    const result = await positionsModel.listOne(req.body.id);  
    if (result) {
        res.json(result);
     } else {
         res.render('fail', {
             data: JSON.stringify({
                 message: '获取数据失败'
             })
         })
 
     }
} 

exports.list = list;
exports.addPositions = addPositions;
exports.removePositions = removePositions;
exports.updatePositions = updatePositions;
exports.listOne = listOne;


