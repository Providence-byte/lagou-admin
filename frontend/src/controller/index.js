import htmlTpl from "../views/index.art"
import { auth as authModel } from '../models/auth'
import img from '../assets/user2-160x160.jpg'
import { showmap } from './map/world-map'
import pageHeader from '../components/pageHeader';
import page from "../databus/page"
//函数柯里化
const index = (router) => {
    return async (req, res, next) => {
        const result = await authModel();
        const mainNav = pageHeader();
        if (result.ret) {
            const html = htmlTpl({
                subRouter: res.subRoute(),
                img,
                mainNav
            })
            next(html)
            //退出登录
            $("#users-signout").on('click', function () {
                // a的优先级比这个go高，所以先把a的默认事件干掉
                localStorage.setItem('lg-token', '');
                location.reload();
            })
            showmap();
            // res.render(htmlTpl({}))
            pageHeader();
            const $as = $('#sidebar-menu li:not(:first-child) a')
            let hash = location.hash;
            $as.filter(`[href="${hash}"]`).parent().addClass('active').siblings().removeClass('active');

            //是否c重置密码
            if(hash !== page.curRouter){
                page.reset();
            }
            //保存当前url
            page.setCurRouter(hash);
        } else {
            router.go('/signin');
        }

    }
}


export default index;