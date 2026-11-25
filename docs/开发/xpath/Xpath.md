---
title: "Xpath"
---

# Xpath

* 参考
	* [csdn](https://blog.csdn.net/caorya/article/details/81839928)
	* [博客园](https://www.cnblogs.com/bubutianshu/p/13206906.html)
	* [用XPath选择第n个元素中的第n个元素](https://www.5axxw.com/questions/content/xkg7wt)

* 知识：

> 选择不包含class属性的节点

```
var result = node.SelectNodes("//span[not(@class)]");
```

> 选择不包含class和id属性的节点

```
var result = node.SelectNodes("//span[not(@class) and not(@id)]");
```

> 选择不包含class="expire"的span

```
var result = node.SelectNodes("//span[not(contains(@class,'expire'))]");
```
> 选择包含class="expire"的span

```
var result = node.SelectNodes("//span[contains(@class,'expire')]");
```
> 获取当前节点上/下一个兄弟节点

```
<div>
    <a id="out_url" href="https://www.baidu.com">BaiDu</a>
    <div>
    	<img src="..." />
    </div>
    <div id="desc">
    	<p>this is baidu.com</p>
         	<b>China</b>
    </div>
</div>
<!-- 
获取 id="desc" 上一个兄弟节点 div 中的图片: 
//div[@id="desc"]/preceding-sibling::div[1]/img/@src

获取 id="out_url" 下一个兄弟节点 div 中的图片:
//div[@id="desc"]/following-sibling::div[1]/img/@src
-->
```

> 获取第N个元素

```
(//ul[@class="merchant-coupons"])[1]
((//ul[@class="merchant-coupons"])[1]/div[@class="merchant-coupons-item-wrapper"])[4]
```
