## 关于这个项目的一些问题

<details>
    <summary>项目是否需要长期启动电脑？</summary>
    需要。因为关闭了电脑就是关闭了这个服务，关闭了这个服务微信公众号就会故障，因为配置的接口无法响应。
</details>

<details>
    <summary>搭建这个是否一定需要云服务器？</summary>
    不必须。如果有云服务器，我可以教部署，已成功给网友linux以及win server部署。教程里介绍的部署方法就是节约成本，利用内网穿透工具送的外网域名映射到本地服务的7001端口.缺点就是电脑不能关机，可以考虑用一台不用的便宜主机当服务器。<br />
    <font color="#f34250">http://127.0.0.1:7001/clearRedis</font>
</details>

<details>
    <summary>为什么需要redis缓存</summary>
    因为天气的接口只有500次免费，超过500次就要付费了，做缓存是为了减少请求次数。
</details>

<details>
    <summary>如何切换城市获取天气</summary>
    服务启动后，会将你在config/config.defalult.js里config.userData的weatherCity设置好，当你想改变的时候，可以将下面地址复制到浏览器地址栏，将xx改为你想要的城市后回车即可，如果设置成功会返回设置成功<br />
    <font color="#f34250">http://127.0.0.1:7001/setCity?city=xx</font>
</details>

<details>
    <summary>如何在更换城市后清楚缓存</summary>
    ~~ 为了这个问题，我特地写了一个接口清除redis的缓存，因为是get请求，所以可以直接复制到浏览器地址那回车, 请确保你服务端已启动。~~不会再存在上面问题，每次设置城市都会清除一次<br />
    <font color="#f34250">http://127.0.0.1:7001/clearRedis</font>
</details>

<details>
    <summary>如果你因为频繁点击导致发送模板失败</summary>
    测试公众号，获取关注用户每天100次，每次发送模板都获取一次。当你因此失败时，你可以通过get请求调用下面接口清除限制(每个月10次)<br />
    <font color="#f34250">http://127.0.0.1:7001/clearQuota</font>
</details>

