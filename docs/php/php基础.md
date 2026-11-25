# PHP 基础知识

## 概述

PHP（Hypertext Preprocessor）是一门开源的服务器端脚本语言，专为 Web 开发设计，代码可嵌入 HTML 中执行。它语法宽松、上手较快，是 Laravel 等主流 PHP 框架的运行基础。学习 Laravel 之前，掌握 PHP 的核心语法是必要前提。

**版本说明**：本文以 PHP 8.x 为基础整理。PHP 8.0 引入了命名参数、构造器属性提升、联合类型、`match` 表达式、空安全运算符等重大特性，Laravel 11+ 要求 PHP 8.2+，Laravel 13 要求 PHP 8.3+。


## 第一章：基础语法与变量

### 1.1 PHP 代码标记

PHP 代码以 `<?php` 开始，以 `?>` 结束（纯 PHP 文件中省略结束标记是推荐做法，可避免意外空白输出）：

```php
<?php
echo "Hello, PHP!";
```

### 1.2 变量

PHP 是动态类型语言，变量无需声明类型，以 `$` 符号开头：

```php
$name = "小明";      // string
$age = 18;           // int
$price = 9.9;        // float
$isActive = true;    // bool
$nothing = null;     // null
```

变量名区分大小写，但函数名不区分。

### 1.3 字符串与拼接

PHP 使用 `.`（点号）拼接字符串，而非 `+`：

```php
$name = "小明";
$age = 18;
echo "我叫" . $name . "，今年" . $age . "岁。";
```

单引号与双引号的区别：双引号中变量会被解析，单引号不会。但在复杂场景（如变量后紧跟中文）下，显式拼接比依赖双引号解析更可靠。

### 1.4 常量

```php
define('SITE_NAME', 'MyApp');
// 或 PHP 5.3+ 的 const 语法（可在类中使用）
const VERSION = '1.0';
```


## 第二章：数据类型

### 2.1 标量类型

| 类型 | 示例 | 说明 |
|---|---|---|
| `int` | `42`、`-7` | 整数 |
| `float` | `3.14`、`1.0e3` | 浮点数 |
| `string` | `"hello"`、`'world'` | 字符串 |
| `bool` | `true`、`false` | 布尔值 |

### 2.2 数组

PHP 数组同时充当索引数组和关联数组（哈希表），两者本质相同：

```php
// 索引数组
$fruits = ["苹果", "香蕉", "橙子"];
echo $fruits[0];  // 苹果

// 关联数组
$user = [
    "name" => "小明",
    "age"  => 18,
    "city" => "北京"
];
echo $user["name"];  // 小明

// 追加元素
$fruits[] = "葡萄";   // 自动分配索引 3
```

常用数组函数：`count()` 计数、`array_push()` 入栈、`array_pop()` 出栈、`array_merge()` 合并、`array_map()` 映射、`array_filter()` 过滤、`in_array()` 判断存在。

### 2.3 类型检查与转换

```php
var_dump($age);            // 输出类型和值，调试必备
get_debug_type($age);      // 返回类型名字符串（PHP 8.0+）
is_int($age);              // 判断是否为整数
is_string($name);          // 判断是否为字符串
(int)$price;               // 强制转换
settype($price, 'integer');// 原地转换
```


## 第三章：运算符

### 3.1 算术运算符

```php
$a + $b;   // 加
$a - $b;   // 减
$a * $b;   // 乘
$a / $b;   // 除（结果可能为 float）
$a % $b;   // 取模，结果符号与被除数 $a 一致
```

### 3.2 比较运算符

| 运算符 | 说明 |
|---|---|
| `==` | 值相等（宽松比较，会做类型转换） |
| `===` | 全等（值和类型都相同） |
| `!=` / `<>` | 值不等 |
| `!==` | 不全等 |
| `>` `<` `>=` `<=` | 大小比较 |

### 3.3 逻辑运算符

```php
$a && $b;   // 与
$a || $b;   // 或
!$a;        // 非
```

### 3.4 空合并与空安全（PHP 8+）

```php
// 空合并：左边为 null 或未定义时取右边
$name = $_GET['name'] ?? '默认名';

// 空安全运算符（PHP 8.0+）：对象为 null 时短路返回 null
$city = $user?->getAddress()?->city;
```


## 第四章：流程控制

### 4.1 条件语句

```php
if ($score >= 90) {
    echo "优秀";
} elseif ($score >= 60) {
    echo "及格";
} else {
    echo "不及格";
}
```

### 4.2 switch 与 match

`switch` 使用宽松比较（`==`），且需要 `break` 防止落穿；`match`（PHP 8.0+）使用严格比较（`===`），自动返回值，无需 `break`，无匹配时抛 `UnhandledMatchError`：

```php
// switch
switch ($role) {
    case 'admin':
        $label = '管理员';
        break;
    default:
        $label = '访客';
}

// match（更简洁，推荐）
$label = match ($role) {
    'admin'  => '管理员',
    'editor' => '编辑',
    default  => '访客',
};
```

`match` 还支持多值合并和条件判断：

```php
$dayType = match ($day) {
    '周六', '周日' => '周末',
    default        => '工作日',
};
```


## 第五章：循环

### 5.1 foreach（最常用）

专用于遍历数组，是 PHP 中最频繁使用的循环：

```php
$fruits = ["苹果", "香蕉", "橙子"];
foreach ($fruits as $item) {
    echo $item . "\n";
}

// 同时取键和值
foreach ($user as $key => $value) {
    echo "$key: $value\n";
}
```

### 5.2 for

适合已知循环次数的场景：

```php
for ($i = 1; $i <= 10; $i++) {
    echo $i . " ";
}
```

### 5.3 while 与 do...while

```php
// while：先判断再执行
$i = 1;
while ($i <= 5) {
    echo $i++;
}

// do...while：至少执行一次
do {
    echo "至少执行一次";
} while (false);
```

### 5.4 break 与 continue

`break` 跳出整个循环，`continue` 跳过当前迭代进入下一次。


## 第六章：函数

### 6.1 定义与调用

```php
function greet(string $name): string {
    return "你好，" . $name;
}

echo greet("小明");  // 你好，小明
```

PHP 8.0 起参数列表允许末尾逗号，便于多行书写。

### 6.2 默认参数与可变参数

```php
function makeCoffee(string $type = "拿铁", int $sugar = 0) {
    return "$type，糖 $sugar 克";
}

// 可变参数
function sum(...$numbers) {
    return array_sum($numbers);
}
echo sum(1, 2, 3, 4);  // 10
```

### 6.3 箭头函数（PHP 7.4+）

```php
$double = fn($n) => $n * 2;
echo $double(5);  // 10
```

箭头函数自动捕获外层变量，适合简单的一行表达式。


## 第七章：面向对象基础

### 7.1 类与对象

```php
class User {
    public string $name;
    private int $age;

    public function __construct(string $name, int $age) {
        $this->name = $name;
        $this->age  = $age;
    }

    public function introduce(): string {
        return "我是 {$this->name}，今年 {$this->age} 岁";
    }
}

$user = new User("小明", 18);
echo $user->introduce();
```

### 7.2 构造器属性提升（PHP 8.0+）

直接在构造器参数中声明属性，省去重复赋值：

```php
class User {
    public function __construct(
        public string $name,
        private int $age,
    ) {}
}
```

### 7.3 继承与访问控制

```php
class Admin extends User {
    public function __construct(string $name, int $age, private string $role) {
        parent::__construct($name, $age);
    }
}
```

访问修饰符：`public`（任意访问）、`protected`（自身及子类）、`private`（仅自身）。

### 7.4 接口与抽象类

```php
interface Notifiable {
    public function notify(string $message): void;
}

abstract class Model {
    abstract public function save(): bool;
}
```

接口定义契约，抽象类可包含部分实现。一个类可实现多个接口，但只能继承一个父类。


## 第八章：超全局变量与表单处理

### 8.1 常用超全局变量

| 变量 | 用途 |
|---|---|
| `$_GET` | URL 查询参数 |
| `$_POST` | POST 请求体数据 |
| `$_REQUEST` | 合并 GET/POST/COOKIE |
| `$_SESSION` | 会话数据 |
| `$_COOKIE` | Cookie 数据 |
| `$_FILES` | 上传文件信息 |
| `$_SERVER` | 服务器与请求信息 |

### 8.2 接收表单数据

```php
// 表单 method="post" 提交后
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';

// 简单过滤
$name = htmlspecialchars(trim($name), ENT_QUOTES, 'UTF-8');
```

**安全提醒**：永远不要直接信任用户输入。Laravel 的验证和 Eloquent 的预处理语句会帮你处理这些问题，但理解底层的过滤和转义是必要的。


## 第九章：异常处理

```php
try {
    $result = 10 / 0;  // 会抛出 DivisionByZeroError
} catch (DivisionByZeroError $e) {
    echo "除零错误：" . $e->getMessage();
} catch (Throwable $e) {
    echo "其他错误：" . $e->getMessage();
} finally {
    echo "无论如何都会执行";
}
```

自定义异常继承 `Exception` 类：

```php
class PaymentException extends Exception {}

try {
    throw new PaymentException("支付失败", 1001);
} catch (PaymentException $e) {
    echo $e->getMessage() . " (code: " . $e->getCode() . ")";
}
```


## 第十章：PHP 8 关键新特性速览

以下特性在 Laravel 源码和现代 PHP 项目中极为常见：

| 特性 | 版本 | 说明 |
|---|---|---|
| 命名参数 | 8.0 | `foo(name: "x", age: 18)` |
| 构造器属性提升 | 8.0 | 构造器参数直接声明属性 |
| `match` 表达式 | 8.0 | 严格比较、返回值、无 break |
| 空安全运算符 `?->` | 8.0 | 链式调用中遇 null 短路 |
| 联合类型 | 8.0 | `int\|string $id` |
| `mixed` 类型 | 8.0 | 表示任意类型 |
| 枚举 Enum | 8.1 | `enum Status { case Active; }` |
| 只读属性 `readonly` | 8.1 | 属性初始化后不可修改 |
| 纤程 Fiber | 8.1 | 轻量级协程基础 |
| `#[\Deprecated]` 属性 | 8.4 | 标记废弃方法 |


## 附录：面向 Laravel 学习的重点提示

学完以上基础后，进入 Laravel 前建议重点巩固以下内容：

1. **数组操作**：Laravel 的 Collection 底层大量使用数组函数，`array_map`、`array_filter`、`array_reduce` 必须熟练。
2. **闭包与箭头函数**：路由定义、中间件、集合操作中闭包无处不在。
3. **命名空间**：`namespace` 和 `use` 是理解 Laravel 类引用的前提。Composer 的 PSR-4 自动加载依赖命名空间与目录结构的对应关系。
4. **类型声明**：Laravel 源码和现代 PHP 项目大量使用参数类型、返回类型、联合类型。
5. **异常处理**：Laravel 的异常处理器基于 PHP 异常体系构建，理解 `try/catch` 和自定义异常是读懂框架错误处理的基础。

**推荐实践**：用 PHP 原生写一个简单的“文章列表 + 表单提交 + 数据保存到文件”的小脚本，不借助任何框架。这个练习能串联变量、数组、循环、函数、表单处理、文件操作等核心知识，之后再进入 Laravel 会顺畅很多。