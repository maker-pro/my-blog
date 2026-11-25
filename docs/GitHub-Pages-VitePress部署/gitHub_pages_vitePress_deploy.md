# GitHub Pages + VitePress 知识库部署手册

> 适用场景：在 Windows 电脑上维护 Markdown 笔记，使用 GitHub
> 保存源码，通过 VitePress 生成静态网站，再由 GitHub Pages
> 免费托管，并通过 GitHub Actions 自动构建和发布。
>
> 示例仓库：`maker-pro/my-blog`\
> 示例网站：`https://maker-pro.github.io/my-blog/`\
> 本地项目目录示例：`D:\project\my-blog`

------------------------------------------------------------------------

## 目录

1.  [整体方案与工作原理](#1-整体方案与工作原理)
2.  [准备工作](#2-准备工作)
3.  [创建或克隆 GitHub 仓库](#3-创建或克隆-github-仓库)
4.  [配置当前项目的 Git 身份](#4-配置当前项目的-git-身份)
5.  [安装和初始化 VitePress](#5-安装和初始化-vitepress)
6.  [规划知识库目录](#6-规划知识库目录)
7.  [配置 VitePress](#7-配置-vitepress)
8.  [创建和添加 Markdown 文章](#8-创建和添加-markdown-文章)
9.  [本地预览和构建检查](#9-本地预览和构建检查)
10. [配置 GitHub Actions 自动部署](#10-配置-github-actions-自动部署)
11. [开启 GitHub Pages](#11-开启-github-pages)
12. [首次发布与日常更新](#12-首次发布与日常更新)
13. [常见问题与排查](#13-常见问题与排查)
14. [日常维护建议](#14-日常维护建议)
15. [完整检查清单](#15-完整检查清单)

------------------------------------------------------------------------

## 1. 整体方案与工作原理

本方案使用以下组件：

  组件                作用
  ------------------- ---------------------------------------
  Markdown（`.md`）   编写和保存知识库文章
  Git                 记录文件变更和版本历史
  GitHub Repository   保存项目源码和 Markdown 文件
  VitePress           将 Markdown、主题和配置构建成静态网站
  GitHub Actions      在代码推送后自动执行构建和部署任务
  GitHub Pages        托管构建后的静态网站

### 1.1 自动部署流程

``` text
Windows 本地电脑
    |
    | 编辑、添加 Markdown 文件
    v
git add / git commit
    |
    | git push origin main
    v
GitHub 仓库 main 分支
    |
    | 触发 GitHub Actions
    v
GitHub Actions 云端运行环境
    |
    | 检出源码
    | 安装 Node.js
    | npm ci
    | npm run docs:build
    v
生成 docs/.vitepress/dist 静态文件
    |
    | 上传 Pages artifact
    v
GitHub Pages 发布
    |
    v
https://maker-pro.github.io/my-blog/
```

### 1.2 重要概念

-   **GitHub 仓库中保存的是源码**：Markdown、VitePress
    配置、主题和工作流文件。
-   **GitHub Pages 发布的是构建产物**：通常是 `docs/.vitepress/dist/`
    目录中的 HTML、CSS、JavaScript 和图片。
-   **GitHub Pages 不负责运行 PHP、Python、Node.js
    后端程序**：它适合静态网站，不提供数据库或后端运行环境。
-   **只执行 `git push` 不会自动把 Markdown 变成网页**：必须有 GitHub
    Actions 工作流执行 VitePress 构建并发布。
-   **本方案不需要自己的 Linux 服务器、Docker、Nginx 或数据库**。

------------------------------------------------------------------------

## 2. 准备工作

本地电脑建议准备：

1.  Windows 10/11。
2.  Git。
3.  Node.js（建议使用当前受支持的 LTS 版本）。
4.  npm（随 Node.js 安装）。
5.  VS Code、PhpStorm 或其他 Markdown 编辑器。
6.  GitHub 账号。

检查 Git、Node.js 和 npm：

``` bash
git --version
node -v
npm -v
```

如果命令无法识别，需要先安装对应软件，并重新打开终端。

------------------------------------------------------------------------

## 3. 创建或克隆 GitHub 仓库

本手册使用已有仓库：

``` text
https://github.com/maker-pro/my-blog
```

### 3.1 克隆仓库

在 PowerShell 中执行：

``` powershell
cd D:\project

git clone https://github.com/maker-pro/my-blog.git

cd my-blog
```

如果仓库已经克隆过，不要重复执行 `git clone`，直接进入现有目录：

``` powershell
cd D:\project\my-blog
```

### 3.2 检查远程仓库和分支

``` bash
git remote -v
git branch
git status
```

预期远程地址类似：

``` text
origin  https://github.com/maker-pro/my-blog.git
```

本手册约定使用 `main` 作为发布分支。若仓库默认分支不是
`main`，应先确认实际分支，并同步调整工作流中的分支名称。

### 3.3 如果仓库已经有 README.md

保留即可，不需要删除。后续在现有仓库中增加 VitePress 文件。

------------------------------------------------------------------------

## 4. 配置当前项目的 Git 身份

如果提交时出现：

``` text
Author identity unknown

Please tell me who you are.
```

说明 Git 没有找到提交者名称或邮箱。

如果只想让当前 `my-blog` 项目使用独立身份，在项目根目录执行：

``` bash
git config --local user.name "Maker Pro"
git config --local user.email "你的 GitHub 已验证邮箱"
```

也可以使用 GitHub 提供的 noreply 邮箱，具体地址可在 GitHub 账号的 Email
设置中查看。

检查配置：

``` bash
git config --local user.name
git config --local user.email
git config --local --list
```

### 4.1 Git 配置范围

  参数         生效范围                      配置位置
  ------------ ----------------------------- --------------------------
  `--system`   整台电脑的 Git 用户           系统级配置
  `--global`   当前 Windows 用户的所有仓库   用户级配置
  `--local`    当前 Git 仓库                 当前项目的 `.git/config`

优先级通常是：

``` text
local > global > system
```

因此，当前项目的 `--local` 配置可以覆盖全局配置，不影响其他项目。

注意：Git 提交身份和 GitHub 登录认证是两件事。设置
`user.name`、`user.email` 不会自动完成 GitHub 登录。

------------------------------------------------------------------------

## 5. 安装和初始化 VitePress

在项目根目录（`my-blog`）执行：

``` bash
npm init -y
npm install -D vitepress
```

如果项目原本已经有
`package.json`，不要直接覆盖整个文件；只需要合并所需的 scripts 配置。

### 5.1 配置 package.json

在 `package.json` 的 `scripts` 中添加：

``` json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

这是 scripts 配置示例。保留 npm 安装后生成的
`devDependencies`、版本号以及其他已有字段，不要为了照抄示例而覆盖整个
`package.json`。

安装完成后会生成 `package-lock.json`。这个文件需要提交到 GitHub，因为
GitHub Actions 使用 `npm ci` 安装依赖。

### 5.2 VitePress 项目目录

建议采用以下结构：

``` text
my-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   ├── .vitepress/
│   │   └── config.mts
│   ├── php/
│   ├── golang/
│   ├── redis/
│   ├── rabbitmq/
│   ├── docker/
│   ├── ai/
│   ├── public/
│   └── index.md
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

目录说明：

  目录/文件                        用途
  -------------------------------- -----------------------------
  `docs/`                          网站源文件目录
  `docs/index.md`                  网站首页
  `docs/.vitepress/config.mts`     VitePress 网站配置
  `docs/.vitepress/dist/`          构建生成的静态网站目录
  `docs/public/`                   图片、图标等静态资源
  `.github/workflows/deploy.yml`   GitHub Actions 自动部署配置
  `package.json`                   npm 项目和命令配置
  `package-lock.json`              锁定依赖版本

------------------------------------------------------------------------

## 6. 规划知识库目录

可按技术分类，每篇文章单独保存为 Markdown 文件：

``` text
docs/
├── index.md
├── php/
│   ├── laravel.md
│   ├── mysql.md
│   └── redis.md
├── golang/
│   ├── basic.md
│   ├── goroutine.md
│   └── gin.md
├── redis/
│   └── index.md
├── rabbitmq/
│   ├── index.md
│   ├── exchange.md
│   └── queue.md
├── docker/
│   └── index.md
└── ai/
    ├── index.md
    └── agent.md
```

建议：

-   一个知识点或主题对应一个 `.md` 文件。
-   文件名尽量使用英文、数字和连字符，便于维护链接。
-   分类目录可使用 `index.md` 作为分类首页。
-   图片可以放在 `docs/public/images/`，文章中使用
    `/my-blog/images/example.png`
    这样的站点路径；也可以使用相对路径引用同目录图片。
-   不要把 `node_modules`、构建缓存或生成目录当作文章源文件提交。

------------------------------------------------------------------------

## 7. 配置 VitePress

创建：

``` text
docs/.vitepress/config.mts
```

针对本项目 `maker-pro/my-blog`，示例配置如下：

``` typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Maker Pro',
  description: '个人技术知识库',

  // GitHub 项目站点必须设置为仓库路径
  base: '/my-blog/',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'PHP', link: '/php/laravel' },
      { text: 'Go', link: '/golang/basic' },
      { text: 'Redis', link: '/redis/' },
      { text: 'RabbitMQ', link: '/rabbitmq/' },
      { text: 'Docker', link: '/docker/' }
    ],

    sidebar: {
      '/php/': [
        {
          text: 'PHP',
          items: [
            { text: 'Laravel', link: '/php/laravel' },
            { text: 'MySQL', link: '/php/mysql' },
            { text: 'Redis', link: '/php/redis' }
          ]
        }
      ],

      '/golang/': [
        {
          text: 'Go',
          items: [
            { text: 'Go 基础', link: '/golang/basic' },
            { text: 'Goroutine', link: '/golang/goroutine' },
            { text: 'Gin', link: '/golang/gin' }
          ]
        }
      ],

      '/rabbitmq/': [
        {
          text: 'RabbitMQ',
          items: [
            { text: '概览', link: '/rabbitmq/' },
            { text: '交换机', link: '/rabbitmq/exchange' },
            { text: '队列', link: '/rabbitmq/queue' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/maker-pro/my-blog'
      }
    ],

    footer: {
      message: '持续学习，持续成长',
      copyright: 'Copyright © 2026 Maker Pro'
    }
  }
})
```

### 7.1 为什么 base 必须是 `/my-blog/`？

当前网站是 GitHub 项目站点：

``` text
https://maker-pro.github.io/my-blog/
```

因此 VitePress 的配置必须是：

``` typescript
base: '/my-blog/'
```

如果误写为 `/`，部署后可能出现资源路径错误，例如
CSS、JavaScript、图片无法加载。

如果以后改成用户站点仓库
`maker-pro.github.io`，网站位于域名根目录，通常使用：

``` typescript
base: '/'
```

### 7.2 nav 和 sidebar 的区别

-   `nav`：网站顶部导航栏。
-   `sidebar`：文章页面左侧导航栏。

创建一个 `.md` 文件，并不意味着它会自动出现在左侧导航栏。需要在
`config.mts` 的 `sidebar`
中配置对应入口，或者自行实现自动生成侧边栏的逻辑。

------------------------------------------------------------------------

## 8. 创建和添加 Markdown 文章

例如新增 PHP 的 MySQL 笔记：

``` text
docs/php/mysql.md
```

PowerShell 创建文件：

``` powershell
New-Item docs/php/mysql.md -ItemType File
```

示例内容：

``` markdown
# MySQL 学习笔记

## 一、MySQL 简介

MySQL 是一个关系型数据库。

## 二、索引

### 1. 什么是索引

索引可以帮助数据库更快地定位数据。

### 2. 常见索引

- 普通索引
- 唯一索引
- 主键索引
- 联合索引

## 三、事务

MySQL 事务具有 ACID 特性。
```

然后在 `config.mts` 对应的 sidebar 中添加：

``` typescript
{ text: 'MySQL', link: '/php/mysql' }
```

注意：链接通常不需要写 `.md` 后缀。

### 8.1 图片引用

如果图片放在：

``` text
docs/public/images/mysql-index.png
```

文章中可以使用：

``` markdown
![MySQL 索引示意图](/my-blog/images/mysql-index.png)
```

这里的 `/my-blog/` 是当前 GitHub 项目站点的 base
路径。修改仓库名或部署路径后，应检查图片、下载文件和手写绝对路径是否需要同步调整。

------------------------------------------------------------------------

## 9. 本地预览和构建检查

在项目根目录执行：

### 9.1 安装依赖

``` bash
npm install
```

日常已有 `package-lock.json` 时，本地也可以使用：

``` bash
npm ci
```

### 9.2 启动开发服务器

``` bash
npm run docs:dev
```

终端会显示本地访问地址。使用终端实际输出的地址打开浏览器。

保存 Markdown 文件后，开发服务器通常会自动刷新页面，便于预览。

### 9.3 执行正式构建

``` bash
npm run docs:build
```

构建成功后，默认输出到：

``` text
docs/.vitepress/dist/
```

### 9.4 本地预览构建结果

``` bash
npm run docs:preview
```

建议在推送之前至少完成一次 `npm run docs:build`，确保没有 Markdown
链接、配置或代码错误。

------------------------------------------------------------------------

## 10. 配置 GitHub Actions 自动部署

在项目根目录创建：

``` text
.github/workflows/deploy.yml
```

示例工作流：

``` yaml
name: Deploy VitePress to GitHub Pages

on:
  push:
    branches:
      - main

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # 检出仓库代码
      - name: Checkout
        uses: actions/checkout@v5

      # 安装 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm

      # 配置 GitHub Pages
      - name: Setup Pages
        uses: actions/configure-pages@v4

      # 根据 package-lock.json 安装依赖
      - name: Install dependencies
        run: npm ci

      # 构建 VitePress
      - name: Build VitePress
        run: npm run docs:build

      # 上传构建产物
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      # 发布到 GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

说明：

1.  `push.branches.main`：推送到 `main` 分支时自动触发。
2.  `workflow_dispatch`：允许在 GitHub Actions 页面手动触发。
3.  `permissions`：授予工作流读取仓库、发布 Pages 和申请 OIDC token
    所需权限。
4.  `npm ci`：根据锁定文件安装依赖；需要提交 `package-lock.json`。
5.  `npm run docs:build`：构建 VitePress。
6.  `upload-pages-artifact`：上传构建目录。
7.  `deploy-pages`：将构建产物发布到 GitHub Pages。
8.  `needs: build`：只有构建成功后才执行部署。

注意：

-   上述 Action 版本是本手册示例中的版本号。实际使用前可查看对应 Action
    官方仓库的最新稳定版本和兼容要求。
-   如果仓库默认分支不是 `main`，要同时修改工作流触发分支。
-   如果项目依赖安装失败，先检查 `package.json` 和 `package-lock.json`
    是否同步。
-   这个工作流不需要 SSH 私钥、服务器 IP 或服务器部署账号，因为目标是
    GitHub Pages，而不是自己的 Linux 服务器。

------------------------------------------------------------------------

## 11. 开启 GitHub Pages

进入仓库：

``` text
https://github.com/maker-pro/my-blog
```

打开：

``` text
Settings → Pages
```

在 `Build and deployment` 中设置：

  配置项   应选择
  -------- ----------------
  Source   GitHub Actions

### 11.1 不要选择错误的模板

Source 选择 GitHub Actions 后，页面可能显示：

-   GitHub Pages Jekyll
-   Static HTML
-   Configure
-   create your own

本方案使用自己创建的 `.github/workflows/deploy.yml`，因此：

-   不需要配置 Jekyll。
-   不需要配置 Static HTML 模板。
-   不需要点击这两个模板的 Configure。
-   保持 Source 为 GitHub Actions 即可。

### 11.2 Custom domain

如果暂时没有自己的域名，留空即可。

默认网站地址为：

``` text
https://maker-pro.github.io/my-blog/
```

以后购买域名后，可以再配置 Custom domain 和 DNS。

### 11.3 Enforce HTTPS

使用 GitHub 默认域名时，保持 HTTPS 强制选项开启即可。

### 11.4 Visibility / Enterprise

普通个人技术博客不需要开通 GitHub Enterprise，也不需要为了部署 Pages
购买 Enterprise 试用。

GitHub Free 可以托管公开仓库的 GitHub Pages
网站。若使用私有仓库或需要额外权限，应查看当前套餐对 Pages 的具体限制。

------------------------------------------------------------------------

## 12. 首次发布与日常更新

### 12.1 提交代码前检查

``` bash
git status
```

确认需要提交的文件都在当前项目目录中。

### 12.2 提交和推送

``` bash
git add .
git commit -m "初始化 VitePress 知识库"
git push origin main
```

如果是第一次推送本地 main 分支，且尚未设置上游分支：

``` bash
git push -u origin main
```

### 12.3 查看部署结果

进入：

``` text
https://github.com/maker-pro/my-blog/actions
```

找到 `Deploy VitePress to GitHub Pages` 工作流。

正常情况下：

1.  Build 任务成功。
2.  Deploy 任务成功。
3.  工作流运行显示绿色成功标记。

网站地址：

``` text
https://maker-pro.github.io/my-blog/
```

首次部署可能需要等待一段时间。若工作流成功但网站暂时无法访问，稍等后刷新，并检查
Pages 设置和仓库地址。

### 12.4 以后新增或修改文章

例如新增：

``` text
docs/php/mysql.md
```

操作：

``` bash
git add .
git commit -m "新增 PHP MySQL 学习笔记"
git push origin main
```

GitHub Actions 自动执行：

``` text
检出代码
  → 安装依赖
  → 构建 VitePress
  → 上传构建产物
  → 发布 GitHub Pages
```

不需要手动登录服务器，也不需要重启 Nginx 或 Docker。

### 12.5 新文章没有显示在左侧导航栏

检查：

``` text
docs/.vitepress/config.mts
```

确认已经把文章链接添加到 `themeConfig.sidebar`。

例如：

``` typescript
'/php/': [
  {
    text: 'PHP',
    items: [
      { text: 'Laravel', link: '/php/laravel' },
      { text: 'MySQL', link: '/php/mysql' }
    ]
  }
]
```

如果只创建了 Markdown 文件但没有配置侧边栏，它可能仍能通过 URL
访问，但不会自动出现在手动配置的导航菜单中。

------------------------------------------------------------------------

## 13. 常见问题与排查

### 问题 1：Git 提交提示 Author identity unknown

错误：

``` text
Author identity unknown

Please tell me who you are.
```

原因：当前项目没有配置 Git 提交者身份。

解决：

``` bash
git config --local user.name "Maker Pro"
git config --local user.email "你的 GitHub 邮箱"
```

检查：

``` bash
git config --local --list
```

### 问题 2：GitHub Pages Source 应该选择什么？

选择：

``` text
Settings → Pages → Build and deployment → Source
→ GitHub Actions
```

不要选择 Jekyll 或 Static HTML 模板，因为本项目已经有自己的 VitePress
工作流。

### 问题 3：为什么个人账号页面出现 30-day free trial？

这是 GitHub Enterprise 企业版试用推广页面，不代表个人 GitHub Free
只能免费使用 30 天。

个人博客不需要开通 Enterprise。返回仓库继续配置 Pages 即可。

### 问题 4：网站打开后 CSS、JS 或图片加载失败

优先检查：

``` typescript
base: '/my-blog/'
```

项目站点的 base 必须和仓库路径一致。

另外检查手写图片路径、下载链接和自定义主题资源路径。

### 问题 5：GitHub Actions 构建失败

进入：

``` text
GitHub 仓库 → Actions → 失败的工作流 → Build
```

查看第一个报错步骤。

常见原因：

-   `package.json` 和 `package-lock.json` 不一致。
-   没有提交 `package-lock.json`。
-   Markdown 文件或 VitePress 配置存在语法错误。
-   sidebar 或 nav 中的链接路径不正确。
-   Node.js 版本与依赖不兼容。
-   工作流文件路径或 YAML 格式错误。

先在本地执行：

``` bash
npm ci
npm run docs:build
```

本地构建成功后再推送。

### 问题 6：GitHub Actions 没有自动触发

检查：

1.  是否推送到了 `main` 分支。
2.  工作流是否位于 `.github/workflows/deploy.yml`。
3.  YAML 中 `on.push.branches` 是否包含实际分支。
4.  仓库 Settings → Actions → General 是否允许运行 Actions。
5.  是否有工作流语法错误。

也可以进入 Actions 页面，使用 `workflow_dispatch` 手动触发。

### 问题 7：网站地址 404

检查：

1.  GitHub Pages Source 是否为 GitHub Actions。
2.  Actions 的 Build 和 Deploy 是否都成功。
3.  仓库名是否为 `my-blog`。
4.  VitePress `base` 是否为 `/my-blog/`。
5.  访问地址是否为：

``` text
https://maker-pro.github.io/my-blog/
```

不要把项目站点误写成：

``` text
https://maker-pro.github.io/
```

### 问题 8：新增 MD 文件后，左侧菜单没有新增文章

原因：手动配置的 sidebar 不会因为新增文件而自动变化。

解决：在 `docs/.vitepress/config.mts` 中添加对应条目，再提交并推送。

### 问题 9：npm ci 提示缺少 lock 文件

检查项目根目录是否有：

``` text
package-lock.json
```

如果没有，执行：

``` bash
npm install
```

然后提交：

``` bash
git add package.json package-lock.json
git commit -m "提交 npm lock 文件"
git push origin main
```

### 问题 10：`git push` 被拒绝或提示远程有新提交

先检查：

``` bash
git status
git fetch origin
git log --oneline --graph --decorate --all -10
```

确认远程变更后，再选择合适的合并或 rebase
方式。不要在不了解差异的情况下直接强制推送。

### 问题 11：本地能访问，线上图片无法显示

检查图片是否放在 `docs/public/`，以及引用路径是否包含 `/my-blog/`。

例如：

``` markdown
![示意图](/my-blog/images/example.png)
```

也要检查文件名大小写。GitHub Pages 部署环境区分大小写，而 Windows
本地文件系统通常不区分。

### 问题 12：为什么修改 Markdown 后线上没有立即更新？

检查：

1.  是否执行了 `git add`、`git commit` 和 `git push`。
2.  是否推送到了 `main`。
3.  GitHub Actions 是否成功。
4.  浏览器是否缓存旧页面。

本地开发服务器保存文件后通常会热更新；线上网站需要等 GitHub Actions
构建和发布完成。

------------------------------------------------------------------------

## 14. 日常维护建议

### 14.1 推荐的文章管理方式

``` text
docs/
├── php/
├── golang/
├── redis/
├── rabbitmq/
├── docker/
├── git/
├── linux/
└── ai/
```

### 14.2 推荐的日常工作流程

``` text
1. 本地新增或修改 MD
2. 本地 npm run docs:dev 预览
3. npm run docs:build 检查构建
4. 检查 sidebar 是否需要更新
5. git status 检查变更
6. git add .
7. git commit -m "描述本次修改"
8. git push origin main
9. GitHub Actions 检查部署结果
10. 浏览器检查线上网站
```

### 14.3 文章命名建议

推荐：

``` text
mysql-index.md
redis-stream.md
rabbitmq-dead-letter.md
go-goroutine.md
```

尽量避免：

-   文件名重复。
-   过长的文件名。
-   随意修改已发布文章的路径，导致旧链接失效。
-   文件名大小写不一致。

### 14.4 备份和版本管理

GitHub
仓库本身保存了提交历史，但重要知识库仍建议定期备份到本地或其他存储位置。

可以通过 Git 标签标记重要版本：

``` bash
git tag v1.0.0
git push origin v1.0.0
```

如果需要恢复旧版本，优先通过 Git 历史定位具体提交，再决定回滚方式。

### 14.5 安全注意事项

-   不要把密码、API Key、Token、SSH 私钥提交到公开仓库。
-   不要把个人隐私或公司内部敏感文档放进公开知识库。
-   GitHub Pages 是静态网站托管，不适合保存需要权限控制的私密内容。
-   公开仓库中的 Markdown、图片和构建后网页都可能被他人访问和复制。
-   不要把 `.env`、数据库备份、日志和私密配置文件放进公开仓库。

------------------------------------------------------------------------

## 15. 完整检查清单

### 本地环境

-   [ ] 已安装 Git
-   [ ] 已安装 Node.js 和 npm
-   [ ] 已克隆 `maker-pro/my-blog`
-   [ ] 已确认当前分支为 `main`
-   [ ] 已配置当前项目的 Git `user.name`
-   [ ] 已配置当前项目的 Git `user.email`

### VitePress 项目

-   [ ] 已安装 VitePress
-   [ ] 已配置 `package.json` scripts
-   [ ] 已生成并保留 `package-lock.json`
-   [ ] 已创建 `docs/index.md`
-   [ ] 已创建 `docs/.vitepress/config.mts`
-   [ ] 已配置 `base: '/my-blog/'`
-   [ ] 已创建文章分类目录
-   [ ] 已配置 nav 和 sidebar
-   [ ] 本地 `npm run docs:dev` 可以运行
-   [ ] 本地 `npm run docs:build` 成功

### GitHub Actions 和 Pages

-   [ ] 已创建 `.github/workflows/deploy.yml`
-   [ ] 工作流监听正确的分支 `main`
-   [ ] 工作流权限包含 Pages 部署所需权限
-   [ ] 已将 GitHub Pages Source 设置为 `GitHub Actions`
-   [ ] 没有误选 Jekyll 或 Static HTML 模板
-   [ ] 已推送 `package-lock.json`
-   [ ] GitHub Actions Build 成功
-   [ ] GitHub Actions Deploy 成功
-   [ ] 网站可以通过 `https://maker-pro.github.io/my-blog/` 访问
-   [ ] 新增 Markdown 后可以自动更新线上网站

------------------------------------------------------------------------

## 官方文档

建议收藏以下官方文档：

1.  VitePress 官网：<https://vitepress.dev/>
2.  VitePress 快速开始：<https://vitepress.dev/guide/getting-started>
3.  VitePress 部署：<https://vitepress.dev/guide/deploy>
4.  GitHub Pages 文档：<https://docs.github.com/en/pages>
5.  GitHub Actions 文档：<https://docs.github.com/en/actions>
6.  GitHub Pages
    自定义工作流：<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>

------------------------------------------------------------------------

## 最后总结

整个方案的核心是：

``` text
Markdown 负责写内容
Git 负责版本管理
GitHub 负责保存源码
VitePress 负责生成网站
GitHub Actions 负责自动构建和部署
GitHub Pages 负责托管网站
```

日常只需要：

``` bash
git add .
git commit -m "更新知识库"
git push origin main
```

只要 GitHub Actions 构建和发布成功，网站就会更新。

本手册以 `maker-pro/my-blog`
为示例。以后部署其他知识库时，主要需要调整：

1.  GitHub 仓库地址。
2.  VitePress `base` 路径。
3.  工作流监听的分支。
4.  网站标题、导航和文章目录。
5.  GitHub Pages 的发布设置。
