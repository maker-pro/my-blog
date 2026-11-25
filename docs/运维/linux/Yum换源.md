---
title: "Yum换源"
---

# Yum换源

[参考](https://zhuanlan.zhihu.com/p/92503443)
* 1、如果你的Centos系统没有安装wget软件，在换源之前先安装wget（这里-y的意思是默认安装过程中的所有选项默认填y，表示全部同意）
```
yum install -y wget
```
* 2、通过改名的方式备份源文件
```
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```
* 3、下载新的源（国内源有很多，常见的有阿里源，网易源，清华源等，自行取用就好）
```
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS6-Base-163.repo
```
* 4、将服务器上的软件包信息在本地缓存，以提高搜索和安装软件的速度
```
yum makecache
```
* 5、更新yum
```
yum update -y
```
