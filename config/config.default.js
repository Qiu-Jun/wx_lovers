
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

  // config.redis = {
  //   client: {
  //     port: 6379, // Redis port
  //     host: '127.0.0.1', // Redis host
  //     password: '',
  //     db: 0,
  //   },
  // };

  // 正式项目要开启
  config.security = {
    csrf: {
		  enable: false,
    },
  };

  config.userData = {
    mineBirth: "2000-06-25", // 自己的生日
    gfBirth: "2002-11-13", // 女朋友的生日
    loveDay: "2023-01-18", // 在一起的日期
    weatherCity: '十堰市' // 需要获取天气的城市，必须时xx市，xx县，xx自治区, 详细可以去utils/amap.js搜索到就可以，比如广州市，不能是广州
  }

  config.userCity = {
    "adname":"十堰市",
    "adcode":"420303"
  }

  // 寄言 一旦设置了就不会请求接口，在这里随机返送一条
  config.words = []

  // 手动设置彩虹屁
  config.caihongpi = []

  return {
    ...config,
    ...userConfig,
  };
};
