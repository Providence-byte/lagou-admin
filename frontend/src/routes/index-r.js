import SMERouter from 'sme-router' //前端webpack帮我们编译，不能用require的Node写法

import {signin,index} from '../controller/index-c'

const router = new SMERouter('root');

//守卫路由，跳转任何路由都要经过它
router.use((req) => {
    $.ajax({
        url:'/api/users/isAuth',
        dataType:'json',
        success(result){
            if(result.ret){
                router.go('/index');
            }else{
                // console.log(result);
                router.go('/signin');
            }
        }
    })
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