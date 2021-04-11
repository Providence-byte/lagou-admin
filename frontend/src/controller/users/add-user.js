import page from '../../databus/page';
import addUserTpl from '../../views/add-user.art'
import { addUser as addUserModel } from '../../models/user-add'

//添加用户
export const addUser = () => {
    const html = addUserTpl();
    $('#uses-list-box').after(html);


    const _save = async () => {
        //提交表单
        const data = $('#users-form').serialize();//输出序列化表单值的结果
        const result = await addUserModel(data);
        if (result.ret) {
            page.setCurPage(1);
            //告知index页面要重新加载
            $('body').trigger('addUser');
        }

        const $btnClose = $('#users-close');
        $btnClose.click();
    }
    //点击保存，提交表单
    $('#users-save').on('click', _save);
}
