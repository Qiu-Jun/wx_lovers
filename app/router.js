'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const xml2js = app.middleware.xml2js()

    router.get('/test', controller.wx.test); // 测试用

    router.get('/onWx', controller.wx.verify); // 验证微信消息
    router.get('/getAccessToken', controller.wx.getAccessToken) // 获取getAccessToken
    router.post('/onWx', xml2js, controller.wx.onListen) // 
    router.post('/sendNotify', controller.wx.sendNotify)
};
