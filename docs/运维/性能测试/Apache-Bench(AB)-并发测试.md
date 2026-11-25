---
title: "Apache Bench(AB) 并发测试"
---

# Apache Bench(AB) 并发测试

### 安装
[Window下载地址](https://www.apachelounge.com/download/)

![1791677473047.jpg](/blog-images/f2c3bffe6222dc.jpg)

进入Apache Bench 的bin目录，启动 abs.exe

![1791677507251.jpg](/blog-images/ffba099845b2ad.jpg)

使用例子

```
> abs.exe -n 200 -c 20 测试地址
# -n 后面的200, 表示总共发出200个请求
# -c 后面的20, 表示采用20个并发（模拟 20 个人同时访问）
# 后面的网址表示测试的目标URL
```

结果分析
[参考](https://www.cnblogs.com/gumuzi/p/5617232.html)

![1791677564913.jpg](/blog-images/7a0441bc0fe31a.jpg)

```
Server Software:        BWS/1.1                                        被测试的服务器所用的软件信息
Server Hostname:        www.baidu.com                                  主机名
Server Port:            443                                            被测主机的服务端口号
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES128-GCM-SHA256,2048,128   加密协议
Server Temp Key:        ECDH P-256 256 bits
TLS Server Name:        www.baidu.com

Document Path:          /                                              请求的具体文件
Document Length:        227 bytes                                      请求的文件大小

Concurrency Level:      20                                             并发级别，也就是并发数，请求中－c参数指定的数量
Time taken for tests:   1.009 seconds                                  本次测试总共花费的时间
Complete requests:      100                                            本次测试总共发起的请求数量
Failed requests:        0    失败的请求数量。因网络原因或服务器性能原因，发起的请求并不一定全部成功，通过该数值和Complete requests相除可以计算请求的失败率，作为测试结果的重要参考
Total transferred:      111098 bytes                                   总共传输的数据量
HTML transferred:       22700 bytes                                    从服务器接收到的文件的总大小
Requests per second:    99.11 [#/sec] (mean)                           均(mean)每秒完成的请求数：QPS，这是一个平均值
Time per request:       201.794 [ms] (mean)    从用户角度看，完成一个请求所需要的时间（因用户数量不止一个，服务器完成10个请求，平均每个用户才接收到一个完整的返回，所以该值是下一项数值的10倍。）
Time per request:       10.090 [ms] (mean, across all concurrent requests)    服务器完成一个请求的时间
Transfer rate:          107.53 [Kbytes/sec] received  网络传输速度。对于大文件的请求测试，这个值很容易成为系统瓶颈所在。要确定该值是不是瓶颈，需要了解客户端和被测服务器之间的网络情况，包括网络带宽和网卡速度等信息。
```
