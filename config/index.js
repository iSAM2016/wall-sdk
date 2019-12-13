/**
 * 此工程暂时符合 移动端h5的项目， 其他工程请根据实际情况改动一些地址路径
 * uat/prod 是需要使用oss. oss完整路径是 `${baseurl}/${publicPath}${assetsSubDirectory}/` 注意斜杠
 *
 * assetsSubDirectory 项目名称必填
 *       * 要放到服务器上 尽量做到不重名
 *       * 本地开发也需要使用
 * title:  网页title名称
 * dev:{}  本地开发配置
 * uat:{}  预发布开发配置
 * prod:{} 线上开发配置
 *
 * isdev      是否是开发环境
 * assetsRoot 静态资源服务器路径   具体数值惨老department.js 不过不好使 请看服务器确定
 * publicPath 静态资源oss路径前缀  具体请看oss
 * baseurl    静态资源域名
 * root  服务器用户名
 *
 * uat/prod 的静态资源处理
 * 1. 静态文件上传到服务器，只是使用index.html 其他但不使用
 * 2. 静态文件传到oss,不要上传index.html 实际请求静态文件是访问oss路径
 *
 *
 * clear  目录没有解决，不过没有太大影响 后续增加
 */
var assetsSubDirectory = 'appActive'; // 根目录

module.exports = {
    assetsSubDirectory,
    title: '三好学生活动', // document title
    dev: {
        isdev: true,
        port: 8001,
        root: 'XXX@dev01.bj.XXX.cc',
        publicPath: './',
        assetsRoot: `/data/static/wb/${assetsSubDirectory}/`,
        baseurl: '//wb.XXX.cn'
    },
    uat: {
        isdev: false,
        root: 'work@inner57.bj.XXX.cc',
        publicPath: `web-development/wb/`,
        assetsRoot: `~/uat_static/wb/static/www/${assetsSubDirectory}/`,
        baseurl: '//static.XXX.com/'
    },
    prod: {
        isdev: false,
        publicPath: 'web/wb/',
        assetsRoot: `~/XXX_online_8504/static/www/${assetsSubDirectory}/`,
        baseurl: '//static.XXX.com',
        server: [
            {
                host: 'work@wb01.bj.XXX.cc',
                username: 'work@$wb01.bj.XXX.cc',
                password: 'wlcz1rH'
            },
            {
                host: 'work@wb02.bj.XXX.cc',
                username: 'work@$wb02.bj.XXX.cc',
                password: 'wlcz1rH'
            },
            {
                host: 'work@3.bj.XXX.cc',
                username: 'work@$3.bj.XXX.cc',
                password: 'wlcz1rH'
            }
        ]
    },

    oss: {},
    // projectPath,
    osspath: '//static.XXX.com', // oss 路径'
    global
    // jsonPath: `${global.__PUBLICPATHMAP__}/${projectPath}`  //json css js 配置文件所在目录
};
