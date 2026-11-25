# Laravel 学习指南

## 概述

Laravel 是一个基于 PHP 的开源 Web 应用框架，遵循 MVC 设计模式，以优雅简洁的语法和强大的工具链著称。它提供了 Eloquent ORM、Blade 模板引擎、路由、认证授权、队列、任务调度等全套功能，是目前最受欢迎的 PHP 框架之一。

**学习前提**：Laravel 13 要求 PHP 8.3 或更高版本。如果你尚未安装 PHP 和 Composer，官方提供了一行命令同时安装 PHP、Composer 和 Laravel 安装器。

---

## 第一章：环境搭建与创建项目

### 1.1 安装 Laravel 安装器

如果你已有 PHP 和 Composer，全局安装 Laravel 安装器：

```bash
composer global require laravel/installer
```

如需全新安装（含 PHP、Composer、Laravel 安装器），macOS/Linux 用户可执行：

```bash
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

Windows 用户在 PowerShell（管理员模式）中执行官方脚本。安装完成后**重启终端**，确保命令全局可用。

### 1.2 创建新项目

```bash
laravel new my-app
```

安装器会交互式询问几个选项。**初学者建议**：Starter Kit 选“None”（手动搭建以理解原理），数据库选 SQLite（无需额外配置），npm install 选“yes”。

创建完成后进入目录并启动：

```bash
cd my-app
composer run dev
```

访问 `http://localhost:8000` 看到欢迎页即成功。

### 1.3 目录结构速览（Laravel 11+ 精简后）

| 目录/文件 | 作用 |
|---|---|
| `app/` | 核心代码：`Http/Controllers/`（控制器）、`Models/`（模型） |
| `routes/` | 路由定义：`web.php`（Web 路由）、`console.php`（命令行） |
| `resources/views/` | Blade 视图文件 |
| `config/` | 配置文件 |
| `database/migrations/` | 数据库迁移文件 |
| `public/` | Web 根目录，入口 `index.php` |
| `storage/` | 日志、缓存、上传文件 |
| `.env` | 环境变量（数据库连接、密钥等） |

Laravel 11 起大幅精简了 `app/` 下的默认文件，仅保留 `Http/Controllers/Controller.php`、`Models/User.php` 和 `Providers/AppServiceProvider.php`。

---

## 第二章：路由与控制器

### 2.1 基本路由

路由定义在 `routes/web.php` 中。最简形式：

```php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Hello, Laravel!';
});

Route::get('/about', function () {
    return view('about');
});
```

支持的方法包括 `get`、`post`、`put`、`patch`、`delete` 等。

### 2.2 路由指向控制器

```php
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
```

### 2.3 创建控制器

```bash
php artisan make:controller HomeController
```

生成 `app/Http/Controllers/HomeController.php`。如需包含全部增删改查方法，加 `--resource`：

```bash
php artisan make:controller ArticleController --resource
```

会按 RESTful 规范生成 `index`、`create`、`store`、`show`、`edit`、`update`、`destroy` 七个方法。

### 2.4 资源路由

```php
Route::resource('articles', ArticleController::class);
```

一行代码即可映射上述七个方法对应的 URL 和 HTTP 动词。

---

## 第三章：Blade 模板引擎

Blade 是 Laravel 的模板引擎，文件后缀为 `.blade.php`，存放在 `resources/views/`。

### 3.1 基础语法

```blade
{{-- 变量输出（自动转义） --}}
<h1>{{ $title }}</h1>

{{-- 不转义输出 --}}
{!! $htmlContent !!}

{{-- 条件 --}}
@if($count > 0)
    <p>共 {{ $count }} 条</p>
@else
    <p>暂无数据</p>
@endif

{{-- 循环 --}}
@foreach($articles as $article)
    <li>{{ $article->title }}</li>
@endforeach
```

### 3.2 布局与继承

定义布局 `resources/views/layouts/app.blade.php`：

```blade
<html>
<head><title>@yield('title')</title></head>
<body>
    @yield('content')
</body>
</html>
```

子视图使用 `@extends` 和 `@section`：

```blade
@extends('layouts.app')

@section('title', '文章列表')

@section('content')
    @foreach($articles as $article)
        <h2>{{ $article->title }}</h2>
    @endforeach
@endsection
```

### 3.3 旧数据填充与 CSRF

表单中保留用户上次输入：

```blade
<input type="text" name="name" value="{{ old('name') }}">
```

表单必须包含 CSRF 令牌：

```blade
<form method="POST" action="/articles">
    @csrf
    ...
</form>
```

---

## 第四章：数据库与 Eloquent ORM

### 4.1 配置数据库

在 `.env` 中设置连接信息。SQLite 无需额外配置，Laravel 会使用 `database/database.sqlite`。MySQL 示例：

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

### 4.2 迁移（Migrations）

创建迁移文件：

```bash
php artisan make:migration create_articles_table
```

编辑 `database/migrations/` 下生成的文件：

```php
public function up(): void
{
    Schema::create('articles', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('body');
        $table->timestamps();
    });
}
```

运行迁移：

```bash
php artisan migrate
```

### 4.3 Eloquent 模型

```bash
php artisan make:model Article
```

生成 `app/Models/Article.php`。基本用法：

```php
// 查询所有
$articles = Article::all();

// 条件查询
$article = Article::where('id', 1)->first();
$article = Article::findOrFail(1);

// 创建
Article::create([
    'title' => '标题',
    'body'  => '内容',
]);

// 更新
$article->update(['title' => '新标题']);

// 删除
$article->delete();
```

模型默认对应表名为类名的复数蛇形（`Article` → `articles`）。如需自定义：

```php
protected $table = 'my_articles';
```

### 4.4 批量赋值保护

使用 `create()` 前需在模型中定义 `$fillable`：

```php
protected $fillable = ['title', 'body'];
```

---

## 第五章：请求验证

### 5.1 控制器中验证

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|max:255',
        'body'  => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
    ]);

    Article::create($validated);
    return redirect('/articles');
}
```

验证失败时，Laravel 自动重定向回上一页，错误信息闪存到 session，可直接在 Blade 中显示：

```blade
@if($errors->any())
    <ul>
        @foreach($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
@endif
```

常用规则：`required`、`email`、`unique:表名`、`min:n`、`max:n`、`confirmed`（要求字段名 `_confirmation` 匹配）。

---

## 第六章：Artisan 命令行

Artisan 是 Laravel 的命令行工具，位于项目根目录的 `artisan` 文件。

| 命令 | 作用 |
|---|---|
| `php artisan serve` | 启动开发服务器 |
| `php artisan make:controller XxxController` | 创建控制器 |
| `php artisan make:model Xxx` | 创建模型 |
| `php artisan make:migration xxx` | 创建迁移 |
| `php artisan migrate` | 运行迁移 |
| `php artisan migrate:rollback` | 回滚最近一次迁移 |
| `php artisan tinker` | 交互式控制台（可直接操作数据库） |
| `php artisan route:list` | 查看所有已注册路由 |
| `php artisan db:seed` | 运行数据填充 |

`tinker` 对调试非常有用，可在命令行中直接执行 Eloquent 操作。

---

## 第七章：学习路线建议

### 第一阶段：基础入门（1–2 周）
- 完成安装与项目创建，熟悉目录结构
- 掌握路由定义与控制器基本用法
- 学会 Blade 模板的变量输出、条件、循环和布局继承
- 跑通一个“文章列表 + 详情页”的静态数据版本

### 第二阶段：数据库与 CRUD（2–3 周）
- 理解迁移机制，会创建表结构
- 掌握 Eloquent 的增删改查
- 实现完整的文章 CRUD（含表单验证）
- 学会使用 `tinker` 调试数据

### 第三阶段：进阶功能（3–4 周）
- **认证系统**：Laravel Breeze 或 Jetstream 快速搭建登录注册
- **中间件**：理解 `auth`、`guest` 等中间件的作用
- **文件上传**：`Storage` 门面的使用
- **队列与任务调度**：将耗时任务异步化
- **测试**：PHPUnit 或 Pest 的基础用法

### 第四阶段：项目实战
选择一个小型项目（如博客、待办清单、短链接服务）完整实现，涵盖：
- 用户注册/登录
- 资源的增删改查
- 权限控制（用户只能编辑自己的内容）
- 分页与搜索
- 简单的 API 接口

### 推荐资源
- **官方文档**：`laravel.com/docs`（最权威，随版本更新）
- **中文社区**：LearnKu Laravel 板块（教程与问答）
- **Laravel News**：`laravel-news.com`（版本动态与技巧）
- **视频课程**：Laravel 官方推出的 Laravel Bootcamp（免费）

---

## 附录：Laravel 13 新特性速览（2026 年发布）

如果你学习的是最新版本，以下特性值得关注：

- **PHP Attributes 原生支持**：模型、任务、命令等可用 `#[Table]`、`#[Fillable]` 等属性替代类属性配置
- **Laravel AI SDK**：第一方 AI 工具包，统一文本生成、Agent、Embeddings、音频等 API
- **JSON:API Resources**：原生支持 JSON:API 规范响应
- **向量/语义搜索**：基于 PostgreSQL pgvector 的相似度查询
- **队列路由**：`Queue::route()` 集中配置任务的队列与连接
- **`Cache::touch()`**：不读取值直接延长缓存 TTL

学习时建议以所用版本的官方文档为准，不同大版本间存在目录结构和配置方式的差异（如 Laravel 11 的精简骨架）。