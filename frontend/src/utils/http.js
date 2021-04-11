const http = ({
    url,
    type = 'get',
    data = {}
}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            type,
            dataType: 'json',
            headers: {
                'X-Access-Token': localStorage.getItem('lg-token') || ''
            },
            data,
            success(res, textStatus, jqXHR) {
                resolve({
                    res,
                    textStatus,
                    jqXHR
                })
            },
            error(err) {
                reject(err.message)
            }
        })
    })
}

export default http;