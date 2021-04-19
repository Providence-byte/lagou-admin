import { auth as authModel } from '../../models/auth'
import { positionsList as positionsListModel } from '../../models/positions-list'
import { positionsRemove as positionsRemoveModel } from '../../models/positions-remove'
import positionsTpl from '../../views/positions.art'
import positionsListTpl from '../../views/positions-list.art'
import usersListPagesTpl from '../../views/users-list-pages.art'
import pagination from '../../components/pagination';

import page from '../../databus/page'
import { addPosition } from './add-position'
import { updatePosition, fillUpdatePositionTpl } from './update-position'

let dataList = [];

let _list = (pageNo) => {
    //使翻页后id不会重置为一，而是继续增加
    let No = (pageNo - 1) * page.pageSize;
    let start = (pageNo - 1) * page.pageSize;
    $('#positions-list').html(positionsListTpl({
        No,
        data: dataList.slice(start, start + page.pageSize)
    }));
}

let _loadData = async () => {
    //此处异步
    const result = await positionsListModel();
    dataList = result;
    //用户列表分页
    pagination(result, usersListPagesTpl); //_pagination函数会引起curPage的改变，需要通知外侧变量更新
    //数据渲染（只要调用了_loadData就一定会调用_list,
    //而换页时我们就只调用_list，就实现了换页时只渲染新页面，而不重新加载）
    _list(page.curPage);
}

//事件
let _methods = () => {
    //jQuery写代理
    //删除列表项事件
    $('#positions-list').on('click', '.remove', async function () {
        let result = await positionsRemoveModel($(this).data('id'));
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
    $('#positions-list')
        .off('click', '.position-update')
        .on('click', '.position-update', function () {
            fillUpdatePositionTpl($(this).data('id'));
        })
}


const _subscribe = () => {
    //jQuery抛发事件
    $('body').on('changeCurPage', (e, index) => {
        _list(index);
    })
    $('body').on('addPosition', (e) => {
        _loadData();
    })
    $('body').on('updatePosition', (e) => {
        _loadData();
    })
}

const positionList = (router) => {
    const loadIndex = (res, next) => {
        next();
        //渲染表格
        res.render(positionsTpl())

        //初次渲染表格内容（用户列表）
        _loadData();
        _list(1);

        //订阅事件
        _subscribe();
        //添加职位
        addPosition();
        //编辑职位
        updatePosition();
        //将所有页面事件写进_methods方法中，实现事件抽离
        _methods();
    }
    return async (req, res, next) => {
        const result = await authModel();
        if (result.ret) {
            loadIndex(res, next);
        } else {
            // console.log(result);
            router.go('/signin');
        }
    }
}

export default positionList;
