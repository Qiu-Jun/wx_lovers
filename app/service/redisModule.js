
const Service = require('egg').Service;
class RedisService extends Service {
    // 设置
    async set(key, value, saveTime) {
        const { redis } = this.app;
        let JsonValue = JSON.stringify(value);
        if (!saveTime) {
            await redis.set(key, JsonValue);
        } else {
            // 设置有效时间 单位：秒
            await redis.set(key, JsonValue, 'EX', saveTime);
        }
    }
    // 获取
    async get(key) {
        const { redis } = this.app;
        let data = await redis.get(key);
        if (!data) return;
        data = JSON.parse(data);
        return data;
    }

    // 删除
    async del(key) {
        try {
            const { redis } = this.app
            await redis.del(key)
            return true
        } catch (error) {
            return false
        }
    }

    // 清空redis
    async flushall() {
        const { redis } = this.app;
        redis.flushall();
        return;
    }
}

module.exports = RedisService;