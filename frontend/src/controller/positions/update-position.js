import page from '../../databus/page';
import updatePositionTpl from '../../views/update-position.art'
import updatePositionFormTpl from '../../views/positions-form.art'
import { updatePosition as updatePositionModel,fillUpdateData as fillUpdateDataModel } from '../../models/positions-update'

//编辑职位id
export const updatePosition = () => {
    $('#positions-list-box').after(updatePositionTpl());

    const _save = async () => {
        //提交表单
        try {
            let result = await fillUpdateDataModel();
            if (result.ret) {
                page.setCurPage(page.curPage);
                //告知index页面要重新加载
                $('body').trigger('updatePosition');
            }
            const $btnCloseUpdate = $('#positions-close-update');
            $btnCloseUpdate.click();
        } catch (err) {
            console.log(err);
        }

    }
    //点击保存，提交表单
    $('#positions-save-update').off('click').on('click', _save);
}

export const fillUpdatePositionTpl = async (id) => {
    let result = await updatePositionModel(id);
    $('#positions-form-update').html(updatePositionFormTpl({
        data:{
            ...result
        }
    }))
}