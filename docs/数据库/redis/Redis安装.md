---
title: "Redis安装"
---

# Redis安装

* Yum安装

```
# 直接yum 安装的redis 不是最新版本
yum install redis

# 如果要安装最新的redis，需要安装Remi的软件源
# 官网地址：http://rpms.famillecollet.com/
yum install -y http://rpms.famillecollet.com/enterprise/remi-release-7.rpm

# 然后可以使用下面的命令安装最新版本的redis：
yum --enablerepo=remi install redis

# 安装完毕后，即可使用下面的命令启动redis服务
service redis start
# 或者
systemctl start redis

# 查看redis版本
redis-cli --version

# 设置为开机自动启动
chkconfig redis on
# 或者
systemctl enable redis.service

# Redis开启远程登录连接，redis默认只能localhost访问，所以需要开启远程登录。解决方法如下：
# 在redis的配置文件/etc/redis.conf中：
# 1.bind 127.0.0.1改为 #bind 127.0.0.1
# 2.protected-mode yes 改为 protected-mode no
# 3.加入 daemonize no(这个是是否在后台启动不占用一个主程窗口)
```

* Wget 下载安装

```
# 1 安装在 /usr/local/src 目录
cd /usr/local/src
wget http://download.redis.io/releases/redis-5.0.14.tar.gz
tar -zxvf redis-5.0.14.tar.gz
cd redis-5.0.14
make && make PREFIX=/usr/local/redis install
```
