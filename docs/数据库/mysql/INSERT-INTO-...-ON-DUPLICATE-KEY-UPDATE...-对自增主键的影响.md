---
title: "INSERT INTO ... ON DUPLICATE KEY UPDATE... 对自增主键的影响"
---

# INSERT INTO ... ON DUPLICATE KEY UPDATE... 对自增主键的影响

### 参考：[参考](https://blog.csdn.net/weixin_44635509/article/details/109483455)

### 问题：
INSERT INTO ... ON DUPLICATE KEY UPDATE... 增加或者更新数据的时候会发现主键变得比数据量要大
描述:

```
# 新建一张表 (Url 唯一键)
CREATE TABLE `test` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Url` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `u` (`Url`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

第一步：向表中插入一条数据
INSERT INTO test (url, `name`)
VALUES
	(
		'https://www.baidu.com',
		'baidu001'
	) ON DUPLICATE KEY UPDATE `name` =
VALUES
	(`name`);

```

结果如图：

![1791631893428.jpg](/blog-images/9c9999a9855bf8.jpg)

第二步：再向数据库中添加一条数据，Url主键一样，Name字段和第一条数据不一样

```
INSERT INTO test (url, `name`)
VALUES
	(
		'https://www.baidu.com',
		'baidu002'
	) ON DUPLICATE KEY UPDATE `name` =
VALUES
	(`name`);

```

结果如图：
Name字段改变但是ID没有自增

![1791631947653.jpg](/blog-images/d7ba7cd9371837.jpg)

![1791631972792.jpg](/blog-images/ebe38a2f3fd2a5.jpg)

第三步：再向数据库中添加一条数据，Url主键不一样

```
INSERT INTO test (url, `name`)
VALUES
	(
		'https://www.baidu.cn',
		'baiducn001'
	) ON DUPLICATE KEY UPDATE `name` =
VALUES
	(`name`);

```

结果如图：
这时候自增就不是自增 1 了

![1791632011899.jpg](/blog-images/33b137a86d1b6c.jpg)

![1791632032676.jpg](/blog-images/1d764dda2f2448.jpg)

### 结论
由上面测试可以发现，INSERT … ON DUPLICATE KEY UPDATE这种方式在更新数据时，也将auto_increment的值加1，这样持续更新并插入时就会导致数据库自增主键id不连续，并且增长很快。

MySQL中有个参数innodb_autoinc_lock_mode，有3种模式,0,1,2，数据库默认是1的情况下，就会发生上面的那种现象,每次使用INSERT … ON DUPLICATE KEY UPDATE的时候都会把简单自增id增加,不管是发生了insert还是update。当做简单插入（可以确定插入行数）的时候，直接将auto_increment加1，而不会去锁表，这也就提高了性能。

模式0的话不管什么情况都是加上表锁，等语句执行完成的时候再释放，将auto_increment加1。

模式2，什么情况都不加AUTO_INC锁，存在安全问题，当binlog格式设置为Statement模式的时候，从库同步的时候，执行结果可能跟主库不一致，问题很大。因为可能有一个复杂插入，还在执行呢，另外一个插入就来了，恢复的时候是一条条来执行的，就不能重现这种并发问题，导致记录id可能对不上。

### 解决方案

* 修改字段类型为BigInteger（临时方案）。
* 改业务逻辑，将INSERT … ON DUPLICATE KEY UPDATE语句拆开，先查询，后更新。
* 不使用自增主键，让唯一索引来做主键，只要确定目前的自增主键没有实际的用处，但插入删除的时候可能会影响效率。
* 将 innodb_autoinc_lock_mode 设置为0，但这样的话，插入的并发性可能会受很大影响（影响多大待测试）。
