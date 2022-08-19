'use strict';
const Service = require('egg').Service;
const WEEKS  = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const dayjs = require('dayjs')
const apiUrl = {
    tianxing: 'http://api.tianapi.com',
    aitext: 'http://api.qingyunke.com/api.php'
}

class NotifyUtils extends Service {
    // 星期几
    getWeek() {
        return WEEKS[dayjs().day()]
    }

    // 在一起的天数
    getTogetherDays(cur, old) {
        return dayjs(cur).diff(old, 'day') + 1
    }

    // 计算距离生日时间
    birthDays(birthDay) {
        const curDate = Date.now()
        const dateArr = birthDay.split('-')
        dateArr[0] = dayjs(curDate).format('YYYY')
        const curBirthStand = dayjs(dateArr.join('-')).valueOf() // 今年的生日
        if(curDate > curBirthStand) {
            const nextBirth = dayjs(curBirthStand).add(1, 'year')
            return dayjs(nextBirth).diff(curDate, 'day') + 1
        } else {
            return dayjs(curBirthStand).diff(curDate, 'day') + 1 
        }
    }

    // 获取随机励志吉言
    async getLizhi() {
        try {
            const { app, service } = this
            const cacheLizhi = await service.redisModule.get('cacheLizhi')
            if(cacheLizhi) {
                return cacheLizhi
            } else {
                // 不缓存 每天100次
                const res = await app.curl(`${apiUrl.tianxing}/lzmy/index?key=${app.config.apiConfig.tianxing.appKey}`, {
                    method: 'GET',
                    dataType: 'json'
                })
                if(res.data.code === 200) {
                    const word = res.data['newslist'][0]['saying'] || ''
                    await service.redisModule.set('cacheLizhi', word, 20 * 60) // 20分钟
                    return word
                } else {
                    return '暂无数据'
                }
            }
        } catch (error) {
            console.log(error)
            throw new Error('获取随机励志吉言失败')
        }
    }

    // 获取天气
    async getWether() {
        try {
            const { app, service } = this
            const cacheWether = await service.redisModule.get('cacheWether')
            if(cacheWether) {
                return cacheWether
            } else {
                const res = await app.curl(`${apiUrl.tianxing}/tianqi/index?key=${app.config.apiConfig.tianxing.appKey}&city=${app.config.userData.city}`, {
                    method: 'GET',
                    dataType: 'json'
                })
                if(res.data.code === 200) {
                    const wetherData = res.data['newslist'][0] || null
                    await service.redisModule.set('cacheWether', wetherData, 24 * 60 * 60)
                    return wetherData
                } else {
                    throw new Error('获取天气失败')
                }
            }
            
        } catch (error) {
            console.log(error)
            throw new Error('获取随机励志吉言失败')
        }
    }

    // aiText
    async sendAiText(text) {
        try {
            const { app } = this
            if(!text || typeof text !== 'string') return '请输入内容'
            const { key, appid }= app.config.apiConfig.aiChat
            const res = await app.curl(`${apiUrl.aitext}?key=${key}&appid=${appid}&msg=${encodeURI(text)}`, {
                method: 'GET',
                dataType: 'json'
            })
            if(res.data.result === 0) {
                return res.data.content
            } else {
                return 'ai接口错误'
            }
        } catch (error) {
            return 'ai接口错误'
        }
    }


}

module.exports = NotifyUtils;
