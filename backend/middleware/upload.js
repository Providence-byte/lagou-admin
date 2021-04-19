const path = require('path');
const multer = require('multer');
const mime = require('mime');
const fs = require('fs');

let filename = '';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
        let ext = mime.getExtension(file.mimetype);
        filename = file.fieldname + '-' + Date.now() + '.' + ext;
        cb(null, filename);
    }
})

var limits = ({
    fileSize: 200000,
    files: 1
})

function fileFilter(req, file, cb) {
    let acceptType = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/gif'
    ]
    let mimetype = file.mimetype;
    if (!acceptType.includes(mimetype)) {
        cb(new Error('文件格式必须为.png/.jpg/.jpeg/.gif'))
    } else {
        cb(null, true);
    }

    // 如果有问题，你可以总是这样发送一个错误:


}

var upload = multer({
    storage,
    limits,
    fileFilter
}).single('companyLogo')

const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.render('fail', {
                data: JSON.stringify({
                    message: '文件超过200K'
                })
            })
        } else if (err) {
            res.render('fail', {
                data: JSON.stringify({
                    message: err.message
                })
            })
        } else {
            const { companyLogo_old } = req.body;
            if (filename !== '' && companyLogo_old) {
                try {
                    fs.unlinkSync(path.join(__dirname, `../public/uploads/${companyLogo_old}`));
                    req.companyLogo = filename;
                } catch (error) {
                    console.log(error);
                }
            } else if (filename === '' && companyLogo_old) {
                req.companyLogo = companyLogo_old;
            }else{
                req.companyLogo = filename || 'undefined.png' 
            }
            filename = '';
            next();
        }

    })
}

module.exports = uploadMiddleware;