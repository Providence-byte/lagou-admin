class Page{
    constructor(){
        this.pageSize = 3;
        this.curPage = 1;
        this.curRouter = '#/index';
    }
    reset(){
        this.pageSize = 3;
        this.curPage = 1;
    }
    setCurRouter(router){
        this.curRouter = router;
    }
    setCurPage(curPage){
        this.curPage = curPage;
    }

}

export default new Page();