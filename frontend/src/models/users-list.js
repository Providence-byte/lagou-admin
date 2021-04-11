import http from '../utils/http';
export const userList = async () => {
    try{
        let{res} = await http({
            url:'/api/users'
        });
        return res;
    }catch(err){
        console.log(err);
    } 
}
