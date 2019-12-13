import * as $ from 'jquery';
export default ({
    url,
    method = 'get',
    success,
    data,
    fn
}: {
    url: string;
    method: string;
    success: any;
    data: object;
    fn: any;
}) => {
    $.ajax({
        method,
        data,
        // headers: {
        //     Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNDI3MzI3NDIsInVzZXJfbmFtZSI6Ilx1OTY0OHl4IiwiZXhwIjoxNTMyNzQ1NzA3fQ.V4q775_-xYMMgpqy7FE1e0Pwd93KVOvH3DJtx2cMDfY`
        // },
        xhrFields: {
            withCredentials: true
        },
        // 允许跨域
        crossDomain: true,
        url: '//wb.XXX.cn' + url,
        success: (res: any) => {
            let resObj = JSON.parse(res);
            // console.log('res', resObj)
            if (resObj[0] && resObj[0].msg === '请先登录') {
            } else {
                success(resObj);
            }
        }
    });
};
