import http from '../utils/http';
export const userRemove = async (id) => {
    try{
        let{res} = await http({
            url:'/api/users',
            type: 'delete',
            data:{id}
        });
        return res;
    }catch(err){
        console.log(err);
    } 
}
