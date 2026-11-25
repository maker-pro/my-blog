---
title: "Mysql查询优化"
---

# Mysql查询优化

### 查看优化器状态

show variables like 'optimizer\_trace';

### 会话级别临时开启

set session optimizer\_trace="enabled=on",end\_markers\_in\_json=on;

### 设置优化器追踪的内存大小

set OPTIMIZER\_TRACE\_MAX\_MEM\_SIZE=1000000;

### 执行自己的SQL

select host,user,plugin from user;

### information\_schema.optimizer\_trace表

SELECT trace FROM information\_schema.OPTIMIZER\_TRACE;

### 导入到一个命名为xx.trace的文件，然后用JSON阅读器来查看（如果没有控制台权限，或直接交由运维，让他把该 trace 文件，输出给你就行了。 ）。

SELECT TRACE INTO DUMPFILE "E:\test.trace" FROM INFORMATION\_SCHEMA.OPTIMIZER\_TRACE;

***注意：不设置优化器最大容量的话，可能会导致优化器返回的结果不全。***
