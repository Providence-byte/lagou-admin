var express = require('express');
var router = express.Router();

const { addUser,list,remove,signin,signout,isAuth } = require('../controller/users-c');
const { auth } = require('../middleware/auth');

//这里直接通过不同的请求方式来区分路由

//加用户鉴权中间件
router.get('/',auth,list);
router.delete('/',auth,remove);
router.post('/',auth,addUser);
router.post('/signin',signin);
router.get('/signout',auth,signout);
router.get('/isAuth',isAuth);

module.exports = router;
