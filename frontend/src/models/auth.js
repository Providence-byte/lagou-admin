import http from '../utils/http';

export const auth = async ()=>{
    try{
        let{res,textStatus,jqXHR} = await http({
            url:'/api/users/isAuth'
        });
        return res;
    }catch(err){
        console.log(err);
    } 
}

 
