/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
    * built-in config
    * @type {Egg.EggAppConfig}
    **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1660810955000_2288';

  // add your middleware config here
  config.middleware = [ 'onError' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };

  // 正式项目要开启
  config.security = {
    csrf: {
		    enable: false,
    },
  };

  // 公众号配置
  config.wx = {
    appId: 'wx6a908ab36533ea40',
    appSecret: '76d09eb43886a44cf2bb993c99206934',
    token: 'junetext',
    template_id: 'z864JohHWpBSFdsoz-6lVx8r0kS_v0LIYYJ7TEzrupg', // 推送的模板id
    user: 'wx6a908ab36533ea40', // 并非推送用户, 填appid就行了
  };

  config.userData = {
    mineBirth: "1994-03-24", // 自己的生日
    gfBirth: "1994-12-26", // 女朋友的生日
    loveDay: "2007-08-11", // 在一起的日期
    weatherCity: '茂名市' // 需要获取天气的城市，必须时xx市，xx县，xx自治区, 详细可以去utils/amap.js搜索到就可以，比如广州市，不能是广州
  }

  // 第三方
  config.apiConfig = {
    tianxingKey: 'bcaddf1605dd53c3115c5a709082ac6f',
    amap: {
      appKey: 'ad8bb6d95720160279841f45a8e9f0e4',
    },
    // 青云客傻瓜ai聊天
    aiChat: {
      key: 'free',
      appid: '0',
    },
  };

  // 寄言 一旦设置了就不会请求接口，在这里随机返送一条
  config.words = ['为所欲为', '为非作歹', '歹？？？？？？？？？？？？？、']

  // 手动设置彩虹屁
  config.caihongpi = []

  return {
    ...config,
    ...userConfig,
  };
};
