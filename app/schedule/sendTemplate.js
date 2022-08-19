const Subscription = require('egg').Subscription;

class SendTemplate extends Subscription {
    static get schedule() {
        return {
            cron: '0 0 8 1/1 * ?', // cron表达式生成器 http://cron.ciding.cc/
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }

    async subscribe() {
        this.service.wxNotify.snedNotify()
    }
}

module.exports = SendTemplate;

