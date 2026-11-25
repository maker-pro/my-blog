---
title: "php 的犄角旮旯"
---

# &#x20;php 的犄角旮旯

> phpdbg php内置调试器

> gmp php高精度运算处理模块

> hash\_equals 安全版的字符串比较（用于密码 / 签名 / token）==【5.6新增】==
>
> ` 循环比较每一位，但不会提前退出`
>
> > 为什么不能用 2个 = 或者 3个 = ？
> >
> > 普通比较：
> >
> > `$a === $`b
> >
> > 👉 是“逐字符比较”，一旦发现不同就立刻返回
> >
> > 这会导致：
> >
> > ⛔ 执行时间不一致
> >
> > 攻击者可以通过“时间差”一点点猜出正确值（比如 API token、签名）
>
> | 对比   | hash\_equals | ===   |
> | ---- | ------------ | ----- |
> | 安全性  | ✅ 防时间攻击      | ❌ 不安全 |
> | 性能   | 稍慢           | 快     |
> | 使用场景 | 加密/验证        | 普通比较  |

> \_\_debugInfo 加入 \_\_debugInfo()， 当使用 var\_dump() 输出对象的时候， 可以用来控制要输出的属性和值。
>
> ```php
> <?php
> class C {
>     private $prop;
>
>     public function __construct($val) {
>         $this->prop = $val;
>     }
>
>     public function __debugInfo() {
>         return [
>             'propSquared' => $this->prop ** 2,
>         ];
>     }
> }
>
> var_dump(new C(42));
> ?>
>
> // 输出
> /**
> object(C)#1 (1) {
>   ["propSquared"]=>
>   int(1764)
> }
> */
> ```

> gost-crypto 散列算法 【?】

> ~~==HTTP\_RAW\_POST\_DATA==~~  5.6版本废弃，7版本彻底删除
>
> | 对比     | \$HTTP\_RAW\_POST\_DATA | php\://input |
> | ------ | ----------------------- | ------------ |
> | 是否可用   | ❌ 已废弃                   | ✅ 推荐         |
> | PHP版本  | < 5.6                   | 全支持          |
> | 性能     | 较差                      | 更好           |
> | 是否默认开启 | ❌ 需要配置                  | ✅ 默认可用       |

> substr\_compare函数

> gmp\_root 计算大整数的 n 次方根（整数结果，向下取整）==【5.6新增】==
>
> ```php
> $num = gmp_init("20");
> $result = gmp_root($num, 2);
> echo gmp_strval($result); // 4（不是 4.47）
> ```

> gmp\_rootrem 取n次方根的整数部分 和 余数==【5.6新增】==
>
> ```php
> $num = gmp_init(20);
> list($root, $rem) = gmp_rootrem($num, 2);
> echo gmp_strval($root); // 4
> echo gmp_strval($rem);  // 4
> ```

> LDAP (LDAP\_ESCAPE\_DN | LDAP\_ESCAPE\_FILTER)
>
> > DN（路径）👉 类似“文件路径” `cn=John Doe,ou=users,dc=example,dc=com`
> >
> > 👉 表示：这个用户在什么位置

> > Filter（查询条件）👉 类似 SQL WHERE
> >
> > `(uid=john) `👉 表示：查找谁

> > LDAP\_ESCAPE\_DN 转义这些：==, + " \ < > ; = #==👉 因为这些在 DN 里有结构意义
> >
> > LDAP\_ESCAPE\_FILTER 转义这些：==\* (  )  \  \0==👉 因为这些在查询语法里有意义
>
> | 常量                   | 用途   | 处理对象         |
> | -------------------- | ---- | ------------ |
> | `LDAP_ESCAPE_DN`     | 构造路径 | DN（对象地址）     |
> | `LDAP_ESCAPE_FILTER` | 构造查询 | Filter（查询条件） |

> **使用 addslashes 防止mysql注入攻击不安全，建议使用 PDO 预处理**

> **==filter\_var==** 使用特定的过滤器过滤一个变量
>
> ```php
> filter_var(mixed $value, int $filter = FILTER_DEFAULT, array|int $options = 0): mixed
> /*
> 函数接受三个参数：
> 	$value：要过滤的标量数据。
> 	$filter：指定应用的过滤器 ID。[要应用的过滤器。可以使用 FILTER_VALIDATE_* 常量作为验证过滤器，使用 FILTER_SANITIZE_* 或 FILTER_UNSAFE_RAW 作为清理过滤器，也可以使用 FILTER_CALLBACK 作为自定义过滤器。]
> 	$options：用于配置过滤器行为的标志或关联数组。
> */
> ```

> **==yield==** 生成器语法
>
> > 生成器函数看起来像普通函数——不同的是普通函数返回一个值，而生成器可以 yield 生成多个想要的值。 任何包含 yield 的函数都是一个生成器函数。
> >
> > 当一个生成器被调用的时候，它返回一个可以被遍历的对象.当你遍历这个对象的时候(例如通过一个foreach循环)，PHP 将会在每次需要值的时候调用对象的遍历方法，并在产生一个值之后保存生成器的状态，这样它就可以在需要产生下一个值的时候恢复调用状态。
> >
> > 一旦不再需要产生更多的值，生成器可以简单返回，而调用生成器的代码还可以继续执行，就像一个数组已经被遍历完了。
> >
> > ==注意: 生成器能够返回多个值，通过 Generator::getReturn() 可以获取到。==
>
> > ```php
> > function res() {
> >     for ($i = 0; $i < 10; ++$i) {
> >         yield $i;
> >     }
> >     return 'rpg';
> > }
> > $res_list = res();
> > foreach($res_list as $item) {
> >     echo $item . ',';
> > }
> > echo PHP_EOL . 'result: ' . $res_list->getReturn() . PHP_EOL;
> >
> > /*结果
> > G:\test>php 1.php
> > 0,1,2,3,4,5,6,7,8,9,
> > result: rpg
> > */
> > ```

> func\_get\_arg | func\_get\_args | func\_num\_args 获取函数的参数信息

> Closure::call()
>
> > Closure::call() 现在有着更好的性能，简短干练的暂时绑定一个方法到对象上闭包并调用它。
> >
> > ```php
> > class A {private $x = 1;}
> >
> > // PHP 7 之前版本的代码
> > $getXCB = function() {return $this->x;};
> > $getX = $getXCB->bindTo(new A, 'A'); // 中间层闭包
> > echo $getX();
> >
> > // PHP 7+ 及更高版本的代码
> > $getX = function() {return $this->x;};
> > echo $getX->call(new A);
> > ```

> unserialize() 提供过滤

> intdiv 对除法结果取整（向下取整）

> **==preg\_replace\_callback\_array==** 使用回调函数执行正则表达式搜索和替换
