#### 关于github action
github action 可以设置运行环境`ubuntu`, `windows`和`macOs`, 设置windows的话可以直接执行这个项目目录下的`bat`文件，这里方法用的是`ubuntu`

+ 首先fork仓库到你自己的仓库

+ 设置定时任务的时间
```yml
# 修改文件位置 .github/workflows/actions.yml的cron 
# 可以参考这个网站 http://cron.ciding.cc/
...
on:
	schedule:
		# UTC 时间 0 点运行一次
		- cron: '0 0 * * *'
...
```

+ 设置变量(以设置WXAPPID为例子，其他都一样的方式)
    - WXAPPID 微信公众号的appid
    - WXSECRET 微信公众号的密钥
    - WXTOKEN 微信公众号的token
    - TEMPLATEID 微信公众号的模板id
    - TIANXINGKEY 第三方天行的的key
    - AMAPKEY 地图的key，用于获取天气

+ 测试