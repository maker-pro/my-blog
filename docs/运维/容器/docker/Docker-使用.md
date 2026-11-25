---
title: "Docker 使用"
---

# Docker 使用

* Docker 安装 centos7 设置定时任务 (crontab)
 * 1、创建容器时必须设置 --privileged=true 和 /usr/sbin/init，比如 
```
docker run -dit \
-v /docker-link/crawler_master:/app/site \
-p 19880:80 \
-p 19808:8080 \
-e ENABLE_HANGUP=true \
-e ENABLE_WEB_PANEL=true \
--name crawler_master \
--restart always \
--privileged=true \
centos:centos7 \
/usr/sbin/init
```
 * 2、进入容器开启 crond 服务：执行命令 `yum update` 和 `yum install cronie`

```
启动 cron 服务：
systemctl start crond

设置 cron 服务自启动：
systemctl enable crond

检查 cron 服务的状态
systemctl status crond
```

* 把容器打包成镜像

```
docker commit -m '小皮面板' -a 'joewng' 541917bbf982 joewng/xiaopi_web:v1
# joewng/xiaopi_web:v1：
#     joewng是hub.docker.com注册的用户名
#     xiaopi_web是hub.docker.com中自己创建的存储库xiaopi_web
#     v1是tagname(我理解为版本号)
```

* 把镜像上传到hub.docker.com
```
docker push joewng/xiaopi_web:v1
# joewng/xiaopi_web:v1：
#     joewng是hub.docker.com注册的用户名
#     xiaopi_web是hub.docker.com中自己创建的存储库xiaopi_web
#     v1是tagname(我理解为版本号)
```
![1791618670394.jpg](/blog-images/a5821d455e180c.jpg)
