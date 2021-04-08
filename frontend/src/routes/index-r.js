import SMERouter from 'sme-router' //前端webpack帮我们编译，不能用require的Node写法

import {signin,index} from '../controller/index-c'

const router = new SMERouter('root');


//帮助我们做DOM渲染

router.route('/signin',signin(router))
router.route('/index',index(router))


//test
// router.route('/signin',signin(router))

export default router