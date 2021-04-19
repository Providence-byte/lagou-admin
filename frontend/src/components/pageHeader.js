// import indexTpl from '../views/index.art';

const pageHeader = () =>{
    const nav = {
        '#/index/users':{
            mainNav:'用户管理'
        },
        '#/index/positions': {
            mainNav:'职位管理'
        }
    }
    const hash = location.hash;
    if(hash == '#/index/users'){
        return nav['#/index/users'].mainNav
    }else if(hash == '#/index/positions'){
        return nav['#/index/positions'].mainNav
    }else{
        return '请选择右边的服务'
    }
    

}

export default pageHeader;