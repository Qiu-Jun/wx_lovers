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
    router.post('/onWx', xml2js, controller.wx.onListen) // 监听微信消息
    router.post('/sendNotify', controller.wx.sendNotify) // 发送模板

    router.get('/createMenu', controller.wx.createWxMenu) // 创建公众号菜单  因为没有后台管理系统，菜单配置再utils下的menuJson

    router.get('/clearRedis', controller.wx.clearRedis) // 清除redis
    router.get('/clearQuota', controller.wx.clearquota) // 清除45009接口调用频率限制
};
