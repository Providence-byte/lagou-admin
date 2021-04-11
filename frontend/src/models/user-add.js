import http from '../utils/http';

export const addUser = async (data) => {
    try{
        let{res} = await http({
            url:'/api/users',
            type: 'post',
            data
        });
        return res;
    }catch(err){
        console.log(err);
    } 
}
