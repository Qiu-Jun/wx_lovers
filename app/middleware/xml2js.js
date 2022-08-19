'use strict';
const { parseXml } = require('../../utils/xml2js');

module.exports = () => {
    return async (ctx, next) => {
        if (ctx.method === 'POST' && ctx.is('text/xml') === 'text/xml') {
            const promise = new Promise((resolve, reject) => {
                let data = '';
                ctx.req.on('data', chunk => {
                    data += chunk;
                });
                ctx.req.on('end', () => {
                    parseXml(data).then(result => {
                        resolve(result);
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
                });
            });
            await promise.then(result => {
                ctx.request.body = result;
            }).catch(() => {
                ctx.request.body = '';
            });
        }
        await next();
    };
};