import page from '../../databus/page';
import addPositionTpl from '../../views/add-position.art'
import { addPosition as addPositionModel } from '../../models/positions-add'

//添加用户
export const addPosition = () => {
    const html = addPositionTpl();
    $('#positions-list-box').after(html);
    const _save = async () => {
        //提交表单
        try {
            let result = await addPositionModel();
            if (result.ret) {
                page.setCurPage(1);
                //告知index页面要重新加载
                $('body').trigger('addPosition');
            }
            const $btnClose = $('#positions-close');
            $btnClose.click();
        } catch (err) {
            console.log(err);
        }

    }
    //点击保存，提交表单
    $('#positions-save').off('click').on('click', _save);
}
