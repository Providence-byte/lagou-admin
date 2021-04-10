import htmlTpl from "../views/index.art"  //前端webpack帮我们编译，不能用require的Node写法
import signinTpl from "../views/signin.art"
import usersTpl from "../views/users.art"
import usersListTpl from "../views/users-list.art"
import usersListPagesTpl from "../views/users-list-pages.art"

import routers from "../routes/index-r"

const htmlIndex = htmlTpl({});
const htmlSignin = signinTpl({});

const pageSize = 8;
//保留当前页
let curPage = 1;
//dataList就是后端返回的数据data
let dataList = [];

//登录后跳转到首页
let _hundleSubmit = (router) => {
    return (e) => {
        e.preventDefault();
        const data = $('#signin').serialize();//输出序列化表单值的结果
        $.ajax({
            url: '/api/users/signin',
            type: 'post',
            dataType:'json',
            data,
            success(res) {
                if(res.ret){
                    router.go('/index');
                }
                
            }
        })
    }
}
//注册
let _signup = () => {
    const $btnClose = $('#users-close');

    //提交表单
    const data = $('#users-form').serialize();//输出序列化表单值的结果
    $.ajax({
        url: '/api/users',
        type: 'post',
        data,
        success(res) {
            //每次添加新数据都渲染一次
            _loadData();
            _list(1);
        }
    })


    $btnClose.click();
}
//翻页
let _pagination = (data) => {

    let total = data.length;
    let counts = Math.ceil(total / pageSize);
    let pageArray = new Array(counts);
    const htmlPages = usersListPagesTpl({
        pageArray
    });
    $('#users-pages').html(htmlPages);
    //加载完让第一个默认高亮
    _setPageActive(curPage);
}

//逻辑拆分：将list加载和渲染分开，因为我们在点击换页时仅需要渲染，不需要重新加载
let _loadData = () => {
    //此处异步
    //jquery的ajax返回promise
    $.ajax({
        url: '/api/users',
        type: 'get',
        //设置async属性false使其变为同步,可以解决异步问题,但会报warning说影响用户体验
        // async: false,
        success(result) {
            dataList = result.data;
            //用户列表分页
            _pagination(result.data);
            //数据渲染（只要调用了_loadData就一定会调用_list,
            //而换页时我们就只调用_list，就实现了换页时只渲染新页面，而不重新加载）
            _list(curPage);
        }
    })
}

let _list = (pageNo) => {
    //使翻页后id不会重置为一，而是继续增加
    let No = (pageNo - 1) * pageSize;
    let start = (pageNo - 1) * pageSize;
    $('#users-list').html(usersListTpl({
        No,
        data: dataList.slice(start, start + pageSize)
    }));
}

let _setPageActive = (index) => {
    $("#users-pages #users-page-list li:not(:first-child,:last-child)")
        //只找index的那个元素
        .eq(index - 1)
        .addClass('active')
        .siblings()
        .removeClass('active');
}

//函数柯里化
const signin = (router) => {
    return (req, res, next) => {
        //render渲染 加载页面
        res.render(htmlSignin);
        $('#signin').on('submit', _hundleSubmit(router))


    }
}
const index = (router) => {
    
    return (req, res, next) => {
        const loadIndex = (res)=>{
            res.render(htmlIndex)
            //渲染表格
            $('#user-content').html(usersTpl());
            //jQuery写代理
    
            //删除
            $('#users-list').on('click', '.remove', function () {
                $.ajax({
                    url: '/api/users',
                    type: 'delete',
                    data: {
                        id: $(this).data('id')
                    },
                    success() {
                        _loadData()
                        //如果总条数/每页条数 === 当前页数并且是当前页的最后一条被删除后，那么就让当前的页数减一（跳转到前一页）
                        const lastPage = Math.ceil(dataList.length / pageSize) === curPage
                        const restOne = dataList.length % pageSize === 1
                        const notFirst = curPage > 0
                        // console.log(lastPage);
                        // console.log(restOne);
                        // console.log(notFirst);
                        if (lastPage && restOne && notFirst) {
                            curPage--;
                        }
                    }
    
                })
            })
            //翻页
            $("#users-pages").on('click', '#users-page-list li:not(:first-child,:last-child)', function () {
                let index = $(this).index();
                _list(index);
                curPage = index;
                _setPageActive(index);
    
            })
            //设置翻页的左右箭头
            $("#users-pages").on('click', '#users-page-list li:first-child', function () {
                if (curPage > 1) {
                    curPage--;
                    _list(curPage);
                    _setPageActive(curPage);
                }
            })
            $("#users-pages").on('click', '#users-page-list li:last-child', function () {
                let last = Math.ceil(dataList.length / pageSize);
                if (curPage < last) {
                    curPage++
                    _list(curPage);
                    _setPageActive(curPage);
                }
            })
            //设置退出登录
            $("#users-signout").on('click', function () {
                console.log(routers);
                //a的优先级比这个go高，所以先把a的默认事件干掉
                $.ajax({
                    url:'/api/users/signout',
                    //后端一定要设置头部数据格式！！！不然补救起来很麻烦
                    dataType:'json',
                    success(result){
                        if(result.ret){
                            location.reload();
                        } 
                    }
                })
                
            })
            //初次渲染表格内容（用户列表）
            _loadData();
            _list(1);
    
    
    
            //点击保存，提交表单
            $('#users-save').on('click', _signup);
        }
        $.ajax({
            url:'/api/users/isAuth',
            dataType:'json',
            success(result){
                if(result.ret){
                    loadIndex(res);
                }else{
                    // console.log(result);
                    router.go('/signin');
                }
            }
        })

        
    }
}


export {
    signin,
    index
}