---
title: "Mysql面试题"
---

# Mysql面试题

### - null值无法与确定的值作比较，用 is NULL 或者 is not NULL 判断，创建数据表时，字段尽量设置 Not null

![1791637758429.jpg](/blog-images/5f113179a82530.jpg)

```
# null值无法与确定的值作比较，null需要单独拿出来处理
select name from customer
where referee_id <> 2 or referee_id is null;

```

### - Mysql 函数

> substring(string, position, length): 

- string: 指的是需要截取的原字符串
- position: 指的是从哪个位置开始截取子字符串，位置是从 1 开始的，若position为负数则从右往左开始数位置
- length: 指的是需要截取的字符串长度，如果不写，则默认截取从position开始到最后一位的所有字符


> left(string,length)

>> LEFT() 函数返回str字符串中最左边的长度字符。
如果str或length参数为NULL，则返回NULL值。
如果length为0或为负，则LEFT函数返回一个空字符串。
如果length大于str字符串的长度，则LEFT函数返回整个str字符串。

- string: 是要提取子字符串的字符串
- length: 是一个正整数，指定将从左边返回的字符数

> right(string, length)
>> RIGHT(string, length) 从指定字符串的左侧返回指定数量的字符组成的字符串。
如果 length 超出了 string 的长度，RIGHT() 函数返回原始 string。
如果 length 为零或负数，RIGHT() 函数将返回一个空串。
当任意一个参数为 NULL 时，RIGHT() 函数将返回 NULL，比如：RIGHT('Hello', NULL) 结果 NULL; RIGHT(NULl, NULL) 结果 NULL。

- string: 需要从中提取字符的字符串
- length: 需要从字符串中提取字符的数量

> IFNULL(expression, alt_value)
>> 如果第一个参数的表达式 expression 为 NULL，则返回第二个参数 alt_value。

> IF(expression, value_1, value2)
>> 如果第一个参数的表达式 expression 为 true，则返回第二个参数 value_1, 否则返回第三个参数 value_2。


### Mysql语法
- UNION 和 UNION ALL
UNION 操作符用于合并两个或多个 SELECT 语句的结果集。UNION 内部的 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。UNION 是对数据进行并集操作，不包括重复行，同时进行默认排序。
从效率上说，UNION ALL 要比 UNION 快很多,UNION ALL 是对数据进行并集操作，包括重复行，不进行排序


### 存储引擎形容数据库的还是数据库表的
答：形容数据库表的

### 为什么InnoDB表必须建立主键，并且推荐使用整型的自增主键
答：提高性能，Int类型比较大小快

### 索引方法为什么不选择Hash
答：Hash索引方法仅满足“=” 和 “IN” 查找，不支持范围查找。

### Mysql表关联的两种算法【MySQL的几种表关联算法】
答：
* 1、嵌套循环连接 Nested-Loop Join(NLJ) 算法。
* 2、基于块的嵌套循环连接 Block Nested-Loop Join(BNL)算法。

### B+树和B树的特点
答：B树一个节点可以有多个元素，并且都是排好序的，数据存在于叶子和非叶子节点。

B+树一个节点可以有多个元素，并且都是排好序的，数据只存在于叶子节点，叶子节点之间有指针，非叶子节点是有冗余（因为非叶子节点和叶子节点有相同的元素）。

### B+树和B树的区别，B+树为什么做这些优化
答：区别：
B+树叶子节点之间有指针（每个叶子节点包含有相邻叶子节点的指针，带顺序访问指针的B+树提高了区间查找的能力），B树没有

B+树非叶子节点是有冗余

B+树的data都在叶子节点

![1791638224222.jpg](/blog-images/adb164d6375d39.jpg)
![1791638258022.jpg](/blog-images/23133a93f8ee24.jpg)

### Mysql不重启，大量索引加载内存中（占用内存），怎么做优化
答： 

### 从那些方便来对数据库优化
答：
* 1、换数据库，比如mongodb
* 2、sql优化，字段优化，索引优化
* 3、读写分离
* 4、分库分表

### 什么是读写分离
答：因为读多写少。建立两个或多个数据库，使用主从同步（通过binlog）来保证数据的一致性，指定一部分数据库专门用来读取数据，另一部分数据库专门用来写数据，从而提高数据库整体的性能。

### 强制路由
数据库读写分离的情况下，可能因为网络原因主库（写库）更新完数据，从库（读库）没来得及更新成功，用户就开始查询数据了，这种情况因为从库（读库）没有更新数据，此时可能就会报错。这时候我们应该强制路由读取主库（sql语句之前加上"/*master*/"）。

### 什么是脏读、幻读、不可重复读?要怎么处理
这些问题都是MySQL进行事务并发控制时经常遇到的问题。

* 脏读：在事务进行过程中，读到了其他事务未提交的数据。

* 不可重复读：在一个事务过程中，多次查询的结果不一致。

* 幻读：在一个事务过程中，用同样的操作查询数据，得到的记录数不相同。

处理的方式有很多种：加锁、事务隔离、MVCC
加锁:
  > 1、脏读：在修改时加排他锁，直到事务提交才释放。读取时加共享锁，读完释放锁。
  
  > 2、不可重复读：读数据时加共享锁，写数据时加排他锁。
  
  > 3、幻读：加范围锁。
