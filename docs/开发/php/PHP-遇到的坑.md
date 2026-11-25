---
title: "PHP 遇到的坑"
---

# PHP 遇到的坑

### strtotime() 函数在31号时间转换问题
当前时间如果是8月31号，echo date("Y-m-d", strtotime("+1 month")),则会输出 10月1号，并没有输出我们想要的 9月，我们使用 last day of 或者 first day of 修正语句。

#### 修正语句：
- last day of 指定月份的最后一天
- first day of 指定月份的第一天

![1791641027002.jpg](/blog-images/10a0e0323b20a5.jpg)

```
// 如果当前时间是 2022-08-31
//使用 strtotime('+1 month') 来获取下个月 1号会出问题
echo date('Y-m-01', strtotime('+1 month', strtotime('2022-08-31'))); // 输出 2022-10-01，不是我们想要的 2022-09-01

//使用 first day of 来获取下个月 1号
echo date('Y-m-d', strtotime('first day of +1 month', strtotime('2022-08-31'))); // 输出 2022-09-01

// 使用 last day of 获取上个月 最后一天
echo date('Y-m-d', strtotime('last day of -1 month', strtotime('2022-08-31'))); // 输出 2022-07-31

```
