import http from '../utils/http';
export const positionsRemove = async (id) => {
    try{
        let{res} = await http({
            url:'/api/positions/remove',
            type: 'delete',
            data:{id}
        });
        return res;
    }catch(err){
        console.log(err);
    } 
}