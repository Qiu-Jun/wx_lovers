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
    config.middleware = ['onError'];

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: '',
            db: 0,
        },
    }

    // 正式项目要开启
    config.security = {
		csrf: {
		    enable: false
		}
	}

    // 公众号配置
    config.wx = {
        appId: 'wx6a908ab36533ea40',
        appSecret: '76d09eb43886a44cf2bb993c99206934',
        token: 'junetext',
        template_id: 'Z9NaV8KlzSR8-AA7Mb22PjqI1dwq0xggxeMUEjDbhGg', // 推送的模板id
        user: 'wx6a908ab36533ea40', // 测试号里的用户微信号
    }

    config.userData = {
        mineBirth: '1994-03-24', // 自己的生日
        gfBirth: '1994-12-26', // 女朋友的生日
        loveDay: '2007-08-11', // 在一起的日期
        city: '广州' // 获取天气使用
    }

    // 第三方
    config.apiConfig = {
        // 我申请的天行的appKey 最好自己申请, 次数超了大家都用不了()
        tianxing: {
            appKey: 'bcaddf1605dd53c3115c5a709082ac6f'
        }
    }

    return {
        ...config,
        ...userConfig,
    };
};
