
'use strict';

module.exports = {
    ok({ code = 200, data = null, msg = '请求成功', status = 200 } = {}) {
        this.body = { data, msg, code };
        this.status = status;
    },
    fail({code = 400, data = null, msg = '请求失败', status = 200} = {}) {
        this.body = { data, msg, code };
        this.status = status;
    }
};