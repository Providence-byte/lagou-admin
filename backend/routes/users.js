var express = require('express');
var router = express.Router();

const { signup,list,remove } = require('../controller/users-c')

//这里直接通过不同的请求方式来区分路由
router.post('/', signup);

router.get('/',list);

router.delete('/',remove);


module.exports = router;
