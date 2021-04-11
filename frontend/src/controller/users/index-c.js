import htmlTpl from "../../views/index.art"  //前端webpack帮我们编译，不能用require的Node写法
import usersTpl from "../../views/users.art"
import usersListTpl from "../../views/users-list.art"
import usersListPagesTpl from "../../views/users-list-pages.art"

import pagination from "../../components/pagination"
import page from "../../databus/page"

import { addUser } from "./add-user.js"
import { userList as userListModel } from "../../models/users-list";
import { auth as authModel } from '../../models/auth'
import { userRemove as userRemoveModel } from '../../models/user-remove'
const htmlIndex = htmlTpl({});

//每页数据条数
// const pageSize = 8;
//保留当前页
// let curPage = 1;
//dataList就是后端返回的数据data
let dataList = [];





//逻辑拆分：将list加载和渲染分开，因为我们在点击换页时仅需要渲染，不需要重新加载

//list渲染 每页的数据条数
let _list = (pageNo) => {
    //使翻页后id不会重置为一，而是继续增加
    let No = (pageNo - 1) * page.pageSize;
    let start = (pageNo - 1) * page.pageSize;
    $('#users-list').html(usersListTpl({
        No,
        data: dataList.slice(start, start + page.pageSize)
    }));
}
//list加载
let _loadData = async () => {
    //此处异步
    //jquery的ajax返回promise
    const result = await userListModel();
    dataList = result.data;
    //用户列表分页
    pagination(result.data, usersListPagesTpl); //_pagination函数会引起curPage的改变，需要通知外侧变量更新
    //数据渲染（只要调用了_loadData就一定会调用_list,
    //而换页时我们就只调用_list，就实现了换页时只渲染新页面，而不重新加载）
    _list(page.curPage);
}


//事件
let _methods = () => {
    //jQuery写代理
    //删除列表项事件
    $('#users-list').on('click', '.remove', async function () {
        let result = await userRemoveModel($(this).data('id'));
        if (result.ret) {
            _loadData();
            //如果总条数/每页条数 === 当前页数并且是当前页的最后一条被删除后，那么就让当前的页数减一（跳转到前一页）
            const lastPage = Math.ceil(dataList.length / page.pageSize) === page.curPage
            const restOne = dataList.length % page.pageSize === 1
            const notFirst = page.curPage > 0
            if (lastPage && restOne && notFirst) {
                // page.curPage--;
                page.setCurPage(page.curPage - 1);
            }

        }


    })
    //设置退出登录
    $("#users-signout").on('click', function () {
        //a的优先级比这个go高，所以先把a的默认事件干掉
        localStorage.setItem('lg-token', '');
        location.reload();
        // $.ajax({
        //     url: '/api/users/signout',
        //     //后端一定要设置头部数据格式！！！不然补救起来很麻烦
        //     dataType: 'json',
        //     headers:{
        //         'X-Access-Token':localStorage.getItem('lg-token')||''
        //     },
        //     success(result) {
        //         if (result.ret) {
        //             location.reload();
        //         }
        //     }
        // })

    })

}

//****观察者模式
// 订阅事件
const _subscribe = () => {
    //jQuery抛发事件
    $('body').on('changeCurPage', (e, index) => {
        _list(index);
    })
    $('body').on('addUser', (e) => {
        _loadData();
    })
}

//函数柯里化
const index = (router) => {

    return async (req, res, next) => {
        const loadIndex = (res) => {
            res.render(htmlIndex)
            //渲染表格
            $('#user-content').html(usersTpl());
            $('#add-user-btn').on('click', addUser)
            //初次渲染表格内容（用户列表）
            _loadData();
            _list(1);
            //将所有页面事件写进_methods方法中，实现事件抽离
            _methods();
            //订阅事件
            _subscribe();
        }
        const result = await authModel();
        if (result.ret) {
            loadIndex(res);
        } else {
            // console.log(result);
            router.go('/signin');
        }


    }
}


export default index;