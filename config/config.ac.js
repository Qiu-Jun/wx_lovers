
/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

console.log(process)
module.exports = () => {
    const config = exports = {};

    // 公众号配置
    config.wx = {
        appId: process.env.WXAPPID,
        appSecret: process.env.WXSECRET,
        token: process.env.WXTOKEN,
        template_id: process.env.TEMPLATEID, // 推送的模板id
        user: ''
    };

    // 第三方
    config.apiConfig = {
        tianxingKey: process.env.TIANXINGKEY,
        amap: {
            appKey: process.env.AMAPKEY
        },
        // 青云客傻瓜ai聊天
        aiChat: {
            key: 'free',
            appid: '0',
        },
    };

    // 寄言 一旦设置了就不会请求接口，在这里随机返送一条
    config.words = ['我设置了config.words, 01', '我设置了config.words, 02']

    // 手动设置彩虹屁
    config.caihongpi = []

    return {
        ...config
    };
};
