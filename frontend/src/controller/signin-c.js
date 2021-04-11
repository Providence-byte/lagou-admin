import signinTpl from "../views/signin.art"

const htmlSignin = signinTpl({});
//登录后跳转到首页
let _hundleSubmit = (router) => {
    return (e) => {
        e.preventDefault();
        const data = $('#signin').serialize();//输出序列化表单值的结果
        $.ajax({
            url: '/api/users/signin',
            type: 'post',
            dataType:'json',
            headers:{
                'X-Access-Token':localStorage.getItem('lg-token')||''
            },
            data,
            success(res,textStatus, jqXHR) {
                const token = jqXHR.getResponseHeader('X-Access-Token');
                //将token存入本地存储
                localStorage.setItem('lg-token',token);
                if(res.ret){
                    router.go('/index');
                }
                
            }
        })
    }
}
//登录模块
const signin = (router) => {
    return (req, res, next) => {
        //render渲染 加载页面
        res.render(htmlSignin);
        $('#signin').on('submit', _hundleSubmit(router))


    }
}

export default signin;