
> 这个项目原项目是py的，后在小红书网友想要node版本的，所以做了一个。[原项目](https://github.com/erwanjun/weixin_tuisong)

[<font size="5" color="#f34250">关于想部署的人请先进里面看看，尤其是第一点和第二点</font>如果看完还想继续部署，而又不会部署的，可以在底部联系我](./Q%26A.md)

#### 关于域名的问题

<font color="#ed1941" size="4px">其实大家只想要定时消息推送的话，可以忽略域名配置，我这里做了智障机器人、创建公众号菜单以及手动推送</font>

#### 功能
- [x] 定时消息推送/手动消息推动
- [x] 人工智障ai聊天
- [x] 更换第三方天气接口(高德天气，无需担心次数上限的白嫖问题)
- [x] 通过接口设置城市，方便修改城市重新获取天气(设置城市会直接清除天气缓存，目前天气缓存为10分钟)

#### 准备环境
+ redis
> 解决第三方接口频繁请求次数的问题，像第三方天气接口时有次数限制的, 而且一天请求一次就好,window用户可以用phpstudy方便安装;linux可以用宝塔安装;mac的话百度, phpstudy也有mac版本的,但是我没用过,我mac的redis是自己手动安装的
+ 网云穿 ~~(花生壳现在无法免费拿http/https域名)~~
> 为了内网穿透做域名校验,注册就送一个免费的域名,够玩. 当然内网穿透工具并不只有这个,也可以用其他的.这里用网云穿内网穿透到本地的服务端口，理论上只要你电脑不关机，网云穿不挂，那么这个服务可以一直就这么使用,可以节约成本
+ 启动项目

```javascript
// 信息配置在config/config.default.js
// 公众号配置
config.wx = {
    appId: 'wx6a908ab36533ea40',
    appSecret: '76d09eb43886a44cf2bb993c992069345',
    token: '随便填，但非中文，不要太短即可,这个token需要配置到公众号那边的',
    template_id: 'z864JohHWpBSFdsoz-6lVx8r0kS_v0LIYYJ7TEzrupg', // 推送的模板id
    user: 'wx6a908ab36533ea40', // 并非推送用户, 填appid就行了
};

config.userData = {
    mineBirth: "1994-03-24", // 自己的生日
    gfBirth: "1994-12-26", // 女朋友的生日
    loveDay: "2007-08-11", // 在一起的日期
    weatherCity: '茂名市' // 需要获取天气的城市，必须时xx市，xx县，xx自治区, 详细可以去utils/amap.js搜索到就可以，比如广州市，不能是广州
}

// 第三方
config.apiConfig = {
    tianxingKey: 'xxbcaddf10279841f45a8e9f0e4xx',
    amap: {
        appKey: 'xxb6d95720160279841f45a8e9xx',
    },
    // 青云客傻瓜ai聊天
    aiChat: {
        key: 'free',
        appid: '0',
    },
};

// 寄言 一旦设置了就不会请求接口，在这里随机返送一条
config.words = ['为所欲为', '为非作歹', '歹？？？？？？？？？？？？？、']

// 手动设置彩虹屁 一旦设置了就不会请求接口，在这里随机返送一条
config.caihongpi = []
```
```bash
# 先确定你启动了redis和安装了node
# 把项目拉或者下载到本地,然后在项目目录启动终端
npm install 
npm run start
# 当环境配置好  可以直接双击starServer.bat启动服务  双击stopServer.bat停止服务
# 如果要使用sendTemplate.bat发送模板选哟修改里面的 请求地址为你自己的地址  curl  你的地址/sendNotify -X POST


####  以下启动方法只适用window用户
# 1.启动phpstudy, 在界面首页启动redis
# 2.启动服务，双击startServer.bat脚本
# 3.打开网云穿登录，点击启动内网穿透

# // 修改配置后重启
# 1.修改完config/config.default.js后需要重启才能生效
# 2.停止服务 双击stopServer.bat脚本工具
# 3.启动服务 双击startServer.bat脚本工具
```
+ 公众号配置
<p style="color: #f34250;">注意: 只有启动了服务端才可以配置这里, 另外域名换成你自己的域名，即https://www.xxxx.com/onWx</p>

![如图](./gitPic/wxConfig.jpg)

<p style="color: #f34250;font-size: 24px;">大家自己去申请个公众号吧,但是个人的是没办法做推送的. 可以申请测试的, 你和你对象都关注就可以了. 目前的推送是每天八点自动推送给关注的人.也有接口可以调接口推送</p>
<p style="color: #f34250;">目前的推送是每天八点自动推送给关注的人.也有接口可以调接口推送</p>

![如图](./gitPic/qrcode.jpg)

### 添加模板
<p style="color: #f34250;">这里的模板id对应的是config.wx的template_id</p>
<p style="color: #f34250;">模板的话复制下面代码,换行的话回车换行,不然推送的消息就不会换行的</p>

```
{{date.DATA}}
城市：{{city.DATA}}
天气：{{weather.DATA}}
气温：{{temperature.DATA}}
空气湿度：{{humidity.DATA}}
今天是我们恋爱的第{{love_day.DATA}}天
距离小宝生日还有{{gfBirthDays.DATA}}天
距离我的生日还有{{mineBirthDays.DATA}}天
寄言： {{lizhi.DATA}}
{{caihongpi.DATA}}
```

![如图](./gitPic/template.jpg)

## 关于定时推送
> `app/schedule/sendTemplate.js`目前是通过eggjs的定时任务实现的, 在linux, window以及mac下都可以正常运行。目前配置是每天8点推送，[cron表达式请看](http://cron.ciding.cc/)

[<font size="4" color="#f34250">window用户可以点击这个教程利用win自身的计划任务程序执行脚本推送消息</font>](https://juneqiu.gitee.io/blog_build/blogs/other/winPlanWork.html)


+ 因为不需要用node的定时任务，所以我们先把app/schedule下的`sendTemplate.js`删了



## 需要申请的第三方api
+ 高德天气[点这里](https://lbs.amap.com/api/webservice/guide/api/weatherinfo)
+ 天行数据api[点这里](https://www.tianapi.com/)(如果你两个都手动设置，那么可以不用申请天行)
    - 励志古言(如果设置了config.words那么可以不申请这个)
    - 彩虹屁(如果设置了config.words那么可以不申请这个)

## 消息推送有三种方式
+ 调用接口推送(/sendNotify)
+ 自动推送(每天早上八点)
+ 通过公众号发送'发送模板'这个关键字


## 最后
部署起来也挺简单的, 不会的话可以加我微信 ***June_QIU_0324***或者提issue
<p style="color: #f34250;">有服务器和域名的我也可以帮忙部署</p>