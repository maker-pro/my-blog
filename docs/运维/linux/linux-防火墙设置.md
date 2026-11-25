---
title: "linux 防火墙设置"
---

# linux 防火墙设置

* 查看firewall服务状态

```
systemctl status firewalld
```

* 查看firewall的状态

```
firewall-cmd --state
```

* 开启、重启、关闭、firewalld.service服务

```
# 开启
service firewalld start
# 重启
service firewalld restart
# 关闭
service firewalld stop
# 开机启动
systemctl enable firewalld
# 禁止开机启动
systemctl disable firewalld
```

* 查看防火墙规则

```
firewall-cmd --list-all
```

* 查询、开放、关闭端口

```
# 检查防火墙开放的端口
firewall-cmd --permanent --zone=public --list-ports

# 开放一个新的端口
firewall-cmd --zone=public --add-port=8080/tcp --permanent


# 验证新增加端口是否生效
firewall-cmd --zone=public --query-port=8080/tcp

# 防火墙开机自启动
systemctl enable firewalld.service

# 防火墙取消某一开放端口
firewall-cmd --zone=public --remove-port=9200/tcp --permanent
```

* 重启防火墙

```
firewall-cmd --reload
```
