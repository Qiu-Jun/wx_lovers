'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async verify() {
        const { ctx, service } = this
        const { signature, echostr, timestamp, nonce } = ctx.query
        const verifyRes = await service.wx.verifySignature(timestamp, nonce, signature)
        if (verifyRes) {
        // 这里不要返回其他任何东西过去，only echostr is 好
            ctx.body = echostr
        } else {
            ctx.fail()
        }
    }

    // 获取access_token
    async getAccessToken() {
        const { ctx, service } = this
        const accessToken = await service.wx.getAccessToken()
        ctx.ok({
            data: accessToken
        })
    }

    // 监听微信订阅消息
    async onListen() {
        const { ctx, service } = this
        const message = ctx.request.body
        let reply
        if(message.MsgType === 'event') {
            reply = await service.wxNotify.handleEvent(message)
        } else {
            reply = await service.wxNotify.handleMsg(message)
        }
        if (reply) {
            const result = await service.wxNotify.replyMsg(message, reply)
            ctx.body = result
        } else {
            ctx.body = 'success'
        }
    }

    // 发送订阅通知
    async sendNotify() {
        const { service } = this
        await service.wxNotify.snedNotify()
    }

    async createWxMenu() {
        const { service } = this
        await service.wx.createMenu()
    }

    test() {
        const { ctx, app } = this
        console.log("==================================")
        ctx.ok({
            code: 200,
            data: {
                randomHexColor: randomHexColor(),
                wxASToken: app.wxASToken || null
            }
        })
    }
}

module.exports = HomeController;
