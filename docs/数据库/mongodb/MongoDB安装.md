---
title: "MongoDB安装"
---

# MongoDB安装

### MongoDB安装
[参考](https://blog.51cto.com/u_15315127/3213936)
1. 软硬件环境
    - MySQL版本：5.1.50，驱动版本：5.1.6（最新的5.1.13有很多杂七杂八的问题）
    - MongoDB版本：1.6.2，驱动版本：2.1
    - 操作系统：Windows XP SP3（这个影响应该不大）
    - CPU：Intel Core2 E6550 2.33G
    - 内存：2G（足够了）
    - 参数: 除了加大最大连接数之外，均使用默认参数
        - MySQL启动参数：bin\mysqld --no-defaults --console --character-set-server=utf8 --max_connections=1000 --max_user_connections=1000
        - MongoDB启动参数：bin\mongod --dbpath data\ --directoryperdb --rest --maxConns 1000 –quiet
2. SQL 键表语句
```
CREATE TABLE `flt_evecurrent` (
  `NodeID` int(11) NOT NULL DEFAULT '0',
  `FltID` int(11) NOT NULL DEFAULT '0',
  `ObjID` int(11) DEFAULT NULL,
  `StationID` int(11) DEFAULT NULL,
  `EveType` int(11) DEFAULT NULL,
  `Severity` int(11) DEFAULT NULL,
  `ReportTime` date DEFAULT NULL,
  `CreateTime` date DEFAULT NULL,
  `EveContent` varchar(1024) DEFAULT NULL,
  `EveDesc` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`NodeID`,`FltID`)
);
# MongoDB类似，索引按照查询语句的查询字段创建，该例子中为ObjID和CreateTime两个字段创建索引。
# 分别插入100万条记录，并对其做100个用户并发查询操作。
# MySQL每一次都Drop表，MongoDB每一次都删除data目录。
# 查询的时候，从第二次查询开始，连续记录三次。
```
3. 查询结果对比

类型 | 插入时间 | 查询时间
---|---|---
MySQL InnoDB引擎 无索引 | 10分33秒 | 39.516秒、35.907秒、39.907秒
MySQL InnoDB引擎 有索引 | 11分16秒 | 非常不稳定：22.531秒、13.078秒、23.078秒、26.047秒、21.234秒、28.469秒、20.922秒、13.328秒
MySQL MyISAM引擎 无索引 | 3分21秒 | 22.812秒、23.343秒、23.125秒
MySQL MyISAM引擎 有索引 | 3分50秒 | 10.312秒、10.359秒、10.296秒
MongoDB无索引 | 37秒 | 59.531秒、60.063秒、59.891秒
MongoDB有索引 | 50秒 | 3.484秒、3.453秒、3.453秒

4. 磁盘空间占用（有索引时候的占用，无索引情况差不多）
    - MySQL MyISAM：57MB
    - MySQL InnoDB：264MB
    - MongoDB：464MB

### RatHat/Centos7 安装 MongoDB
[参考](https://blog.csdn.net/L184820911/article/details/117024841)
1. 环境变量路径介绍
    - mongodb的bin目录：/etc
    - mongodb的dbpath：/var/lib/mongo
    - mongodb的logpath：/var/log/mongodb/mongod.log
    - mongodb的config路径：/etc

2. Yum 安装

```
# 新建mongodb-org-4.4.repo文件
# vim /etc/yum.repos.d/mongodb-org-4.4.repo`

# 编辑mongodb-org-4.4.repo文件
[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc

# 开始进行安装mongodb的一些相关工具
# yum install -y mongodb-org-4.4.1 mongodb-org-server-4.4.1 mongodb-org-shell-4.4.1 mongodb-org-mongos-4.4.1 mongodb-org-tools-4.4.1
```

3. 关闭、启动、重启、开机启动
    - `sudo systemctl start mongod #启动`
    - `sudo systemctl restart mongo #重启`
    - `sudo systemctl enable mongod #开机启动`
