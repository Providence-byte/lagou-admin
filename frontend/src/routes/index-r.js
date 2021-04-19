import GP21Router from 'gp21-router' //前端webpack帮我们编译，不能用require的Node写法

//将首页模块和登录模块剥离
import index from '../controller/index'
import userList from '../controller/users/user-list'
import positionList from '../controller/positions/position-list'
import signin from '../controller/signin'

import { auth as authModel } from '../models/auth'

const router = new GP21Router('root');

//守卫路由，跳转任何路由都要经过它
router.use(async (req) => {
    const url = req.url;
    let result = await authModel();
    if (result.ret) {
        router.go(url);
    } else {
        // console.log(result);
        router.go('/signin');
    }
})

//帮助我们做DOM渲染
router.route('/signin', signin(router))
router.route('/index', index(router))
router.route('/index/users', userList(router))
router.route('/index/positions', positionList(router))
//路由重定向 要放最后面
router.route('*', (req, res, next) => {
    res.redirect('/index/users')
})

//test
// router.route('/signin',signin(router))

export default router