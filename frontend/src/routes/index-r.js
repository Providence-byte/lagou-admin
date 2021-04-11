import GP21Router from 'gp21-router' //前端webpack帮我们编译，不能用require的Node写法

//将首页模块和登录模块剥离
import index from '../controller/users/index-c'
import signin from '../controller/signin-c'

import { auth as authModel } from '../models/auth'

const router = new GP21Router('root');

//守卫路由，跳转任何路由都要经过它
router.use(async (req) => {
    let result = await authModel();
    if(result.ret){
        router.go('/index');
    }else{
        // console.log(result);
        router.go('/signin');
    }
  })
//定义一个空路由，来使app.js最先进这里，解决进直接index会使翻页那里报错的问题
router.route('/',()=>{
})

//帮助我们做DOM渲染
router.route('/signin',signin(router))
router.route('/index',index(router))


//test
// router.route('/signin',signin(router))

export default router