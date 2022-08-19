'use strict';
const xml2js = require('xml2js');

/**
 * parseXml
 * @desc 解析xml
 * @param { String } str 
 */
const parseXml = str => {
    return new Promise((resolve, reject) => {
        const parseString = xml2js.parseString;
        parseString(str, { explicitArray: false }, (err, json) => {
            if (json) {
                resolve(json.xml);
            } else {
                reject(err);
            }
        });
    });
};

/**
 * createXml
 * @desc 生成xml
 * @param { Object } obj
 */
const createXml = obj => {
    const builder = new xml2js.Builder({
        rootName: 'xml',
        headless: true,
        cdata: true,
    });
    return builder.buildObject(obj);
};

module.exports = {
    parseXml,
    createXml,
};