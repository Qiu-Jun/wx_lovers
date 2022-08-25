'use strict';
const Service = require('egg').Service;
const { createXml } = require('../../utils/xml2js');
const randomHexColor = require('../../utils/randomHexColor')


class WxNotify extends Service {
    /**
     * handleEvent
     * @desc 事件类型
     * @param { Object } message 
     */
    async handleEvent(message) {
        const { service } = this
        const { Event, EventKey, Ticket, Latitude, Longitude, Precision } = message;
        let reply;
        switch (Event) {
            case 'subscribe': // 关注事件
                reply = '欢迎关注我的公众号';
                break;
            case 'unsubscribe': // 取消关注事件
                reply = '';
                break;
            case 'SCAN': // 扫码
                reply = 'EventKey:' + EventKey + ', Ticket:' + Ticket;
                break;
            case 'LOCATION': // 位置
                reply = 'Latitude:' + Latitude + ', Longitude:' + Longitude + ', Precision:' + Precision;
                break;
            case 'CLICK': // 点击
                switch (EventKey) {
                    case 'HANDLE_SEND_TEMDPLATE':
                        await this.snedNotify()
                        reply = ''
                        break;
                    default:
                        reply = '点击事件配置错误';
                        break;
                }
                break;
            case 'VIEW': // 点击菜单跳转链接时的事件推送
                reply = 'EventKey:' + EventKey;
                break;
            default:
                reply = '';
                break;
        }
        return reply;
    }

    /**
     * handleMsg
     * @desc 消息
     * @param { Object } message 
     */
    async handleMsg(message) {
        const { service } = this
        const { MsgType, Content, PicUrl, MediaId, Recognition, Label, Url } = message
        let reply
        switch (MsgType) {
            case 'text': // 文本
                if(Content === '发送模板') {
                    await service.wxNotify.snedNotify()
                    reply = ''
                } else {
                    const aiText = await service.notifyUtils.sendAiText(Content)
                    reply = aiText
                }
                break;
            case 'image': // 图片
                reply = PicUrl
                break;
            case 'voice': // 语音
                console.log(Recognition)
                reply = MediaId
                break;
            case 'video': // 视频
                reply = MediaId
                break;
            case 'shortvideo': // 短视频
                reply = MediaId
                break;
            case 'location': // 位置
                reply = Label
                break;
            case 'link': // 链接
                reply = Url
                break;
            default:
                reply = ''
                break;
        }
        return reply;
    }

    /**
     * replyMsg
     * @desc 回复信息转xml
     * @param {*} message 
     * @param {*} Content 
     */
    async replyMsg(message, Content) {
        const obj = {
            ToUserName: message.FromUserName,
            FromUserName: message.ToUserName,
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content,
        };
        return createXml(obj);
    }

    async snedNotify() {
        try {
            const { ctx, app, service } = this
            const accessToken = await service.wx.getAccessToken()
            const { mineBirth, gfBirth, loveDay } = app.config.userData
            const { words, caihongpi } = app.config
            const curStand = Date.now()
            const curWeek = service.notifyUtils.getWeek() // 星期几
            const lovsDays = service.notifyUtils.getTogetherDays(curStand, loveDay) // 在一起天数
            const mineBirthDays= service.notifyUtils.birthDays(mineBirth) // 距离我的生日时间
            const gfBirthDays = service.notifyUtils.birthDays(gfBirth)
            const weather = await service.notifyUtils.getWether() // 获取天气
            let chp = ''
            let lizhiWord = ''
            if(caihongpi.length) {
                chp = caihongpi[Math.floor(Math.random() * caihongpi.length)]
            } else {
                chp = await service.notifyUtils.getCaihongPi() // 获取彩虹屁
            }
           
            if(words.length) {
                lizhiWord = words[Math.floor(Math.random() * words.length)]
            } else {
                lizhiWord = await service.notifyUtils.getLizhi() // 励志古言
            }
            if(!weather) {
                throw new Error("推送失败，获取天气失败")
            }
            const users = await service.wx.getUsers()
            // 获取关注用户
            if(!users) return ctx.fail({fail: '获取关注用户失败，可能频繁操作出现了限制，请调用clearQuota接口清除'})
            const data = {
                date: {
                    value: curWeek,
                    color: randomHexColor()
                },
                city: {
                    value: weather.city,
                    color: randomHexColor()
                },
                weather: {
                    value: weather.weather,
                    color: randomHexColor()
                },
                temperature: {
                    value: weather.temperature ? `${weather.temperature}°C` : '暂无数据',
                    color: randomHexColor()
                },
                humidity: {
                    value: weather.humidity,
                    color: randomHexColor()
                },
                love_day: {
                    value: lovsDays,
                    color: randomHexColor()
                },
                mineBirthDays: {
                    value: mineBirthDays,
                    color: randomHexColor()
                },
                gfBirthDays: {
                    value: gfBirthDays,
                    color: randomHexColor()
                },
                lizhi: {
                    value: lizhiWord || '暂无数据',
                    color: randomHexColor()
                },
                caihongpi: {
                    value: chp ? chp : '',
                    color: randomHexColor()
                }
            }
            for(let i = 0, j = users.length; i < j; i++) {
                const res = await app.curl(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`, {
                    method: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        touser: users[i],
                        template_id: app.config.wx.template_id,
                        data: data
                    })
                })
                if(res.data.errcode === 40037) {
                    ctx.fail({
                        msg: '推送消息失败，请检查模板id是否正确'
                    })
                } else if(res.data.errcode === 40036) {
                    ctx.fail({
                        msg: '推送消息失败，请检查模板id是否为空'
                    })
                } else if(res.data.errcode === 40003) {
                    ctx.fail({
                        msg: '推送消息失败，请检查微信号是否正确'
                    })
                } else if(res.data.errcode === 0) {
                    ctx.ok() 
                } else {
                    ctx.fail({
                        code: res.data.errcode,
                        msg: res.data.errmsg
                    })
                }
            }
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

}

module.exports = WxNotify;
