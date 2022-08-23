// 公众号相关

'use strict';
const Service = require('egg').Service;
const crypto = require('crypto')
const wxBase = 'https://api.weixin.qq.com/cgi-bin'
const menus = require('../../utils/menuJson.js')
class Wechat extends Service {

    /**
     * verifySignature
     * @desc 验证消息是否来自微信服务器
     * {timestamp, nonce, token} 按字典排序组合在一起，拼接成字符串通过啥sha1加密对比发送过来的signature对比
     */
    async verifySignature(timestamp, nonce, signature) {
        const { app } = this
        const token = app.config.wx.token
        const arr = [token, timestamp, nonce]
        const str = arr.sort().join('')
        const sha1Str = crypto.createHash('sha1').update(str, 'utf-8').digest('hex')
        if (signature !== sha1Str) return false
        return true
    }

    /**
     * getAccessToken
     * @desc 获取access_token 存redis
     */
    async getAccessToken() {
        const { app, service } = this
        const hasAccessToken = await service.redisModule.get('accessToken')
        if (hasAccessToken) {
            return hasAccessToken
        } else {
            const getAccessToken = await app.curl(`${wxBase}/token?grant_type=client_credential&appid=${app.config.wx.appId}&secret=${app.config.wx.appSecret}`, {
                method: 'GET',
                dataType: 'json'
            })
            const token = getAccessToken.data.access_token
            // 7200秒过期，提前
            await service.redisModule.set('accessToken', token, 7180)
            return token
        }
    }

    // 获取关注用户
    async getUsers() {
        const { app, service } = this
        const cacheUsersOpenid = await service.redisModule.get('cacheUsersOpenid')
        if(cacheUsersOpenid) {
            return cacheUsersOpenid
        } else {
            const accessToken = await this.getAccessToken()
            if(!accessToken) throw new Error('accessToken错误')
            const res = await app.curl(`${wxBase}/user/get?access_token=${accessToken}`, {
                method: 'GET',
                dataType: 'json'
            })
            if(res.status === 200 && res.data) {
                const openids = res.data.data.openid
                await service.redisModule.set('cacheUsersOpenid', openids, 7180)
                return openids
            } else {
                return null
            }
        }
    }

    // 公众号创建自定义菜单
    async createMenu() {
        try {
            const { ctx, app } = this
            const accessToken = await this.getAccessToken()
            if(!accessToken) throw new Error('accessToken错误')
            const res = await app.curl(`${wxBase}/clear_quota?access_token=${accessToken}`, {
                method: 'post',
                dataType: 'json',
                data: JSON.stringify(menus)
            })
            if(res.data.errcode === 0) {
                ctx.ok({
                    msg: '自定义成功'
                })
            } else {
                ctx.fail({
                    msg: '自定义失败'
                })
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    // 清除模板频繁限制  每个月10次
    async clearQuota() {
        try {
            const { app } = this
            const accessToken = await this.getAccessToken()
            if(!accessToken) throw new Error('accessToken错误')
            const res = await app.curl(`${wxBase}/clear_quota?access_token=${accessToken}`, {
                method: 'post',
                dataType: 'json',
                data: JSON.stringify({
                    appid: app.config.wx.appId
                })
            })
            const errcode = res.data.errcode
            if(errcode === 0) {
                return '清除成功'
            } else if(errcode === 48006) {
                return '一个月10次的机会用完了'
            } else if(errcode === 40013) {
                return 'appid写错了；或者填入的 appid 与access_token代表的账号的 appid 不一致'
            } else if(errcode === 47001) {
                return '您无需清除'
            } else {
                throw new Error('请求失败')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Wechat;