

import page from "../databus/page"

//设置翻页按钮高亮
let _setPageActive = (index) => {
    $("#users-pages #users-page-list li:not(:first-child,:last-child)")
        //只找index的那个元素
        .eq(index - 1)
        .addClass('active')
        .siblings()
        .removeClass('active');
}
//翻页
let pagination = (data,usersListPagesTpl) => {
    let total = data.length;
    let counts = Math.ceil(total / page.pageSize);
    let pageArray = new Array(counts);
    const htmlPages = usersListPagesTpl({
        pageArray
    });
    $('#users-pages').html(htmlPages);
    //加载完让第一个默认高亮
    _setPageActive(page.curPage);
    //绑定事件
    _bindEvent(data);

}


//事件data
const _bindEvent = (data)=>{
     //点击页数按钮翻页事件
 $("#users-pages").off('click').on('click', '#users-page-list li:not(:first-child,:last-child)', function () {
    let index = $(this).index();
    // _list(index);
    // curPage = index;
    page.setCurPage(index);
    //抛发事件 trigger函数只有两个参数，第一个是事件类型，第二个是要传的参数
    //详见jQuery自定义事件index
    $('body').trigger('changeCurPage',index) //这里的index会传到外部_subscribe的.on事件中
    _setPageActive(index);

})
//设置翻页的左右箭头
$("#users-pages").on('click', '#users-page-list li:first-child', function () {
    if (page.curPage > 1) {
        page.setCurPage(page.curPage-1);
        // page.curPage--;
        $('body').trigger('changeCurPage',page.curPage); //这里相当于做了_list(page.curPage);
        _setPageActive(page.curPage);
    }
})
$("#users-pages").on('click', '#users-page-list li:last-child', function () {
    let last = Math.ceil(data.length / page.pageSize);
    if (page.curPage < last) {
        // page.curPage++
        page.setCurPage(page.curPage+1);
        // _list(page.curPage);
        $('body').trigger('changeCurPage',page.curPage);
        _setPageActive(page.curPage);
    }
})

}

export default pagination;