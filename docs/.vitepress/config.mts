
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Maker Pro',
  description: '个人技术博客，记录技术与成长',

  // 对应 GitHub 仓库名称
  base: '/my-blog/',

  // 浏览器标签页图标
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/my-blog/favicon.svg'
      }
    ]
  ],

  themeConfig: {
    // 左上角网站 Logo
    logo: {
      src: '/logo.svg',
      alt: 'Maker Pro'
    },

    siteTitle: 'Maker Pro',

    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '💻 开发与编程', link: '/开发/' },
      { text: '🗄️ 数据库', link: '/数据库/' },
      { text: '🛠️ 运维与工具', link: '/运维/' },
      { text: '📝 生活随笔', link: '/随笔/' }
    ],

    sidebar: {
      '/开发/': [
        {
          text: '💻 开发与编程',
          items: [
            { text: '分类目录', link: '/开发/' },
            {
              text: 'PHP',
              collapsed: false,
              items: [
                { text: 'PHP 基础知识', link: '/开发/php/php基础' },
                { text: 'JWT认证', link: '/开发/php/JWT认证' },
                { text: 'PHP 遇到的坑', link: '/开发/php/PHP-遇到的坑' },
                { text: 'php 的犄角旮旯', link: '/开发/php/php-的犄角旮旯' },
                { text: '关于父子分类一些处理', link: '/开发/php/关于父子分类一些处理' },
                {
                  text: 'Laravel',
                  collapsed: false,
                  items: [
                    { text: 'Laravel 学习指南', link: '/开发/php/laravel/laravel' }
                  ]
                },
                {
                  text: 'ThinkPHP',
                  collapsed: false,
                  items: [
                    { text: 'ThinkPHP6智障坑', link: '/开发/php/thinkphp/ThinkPHP6智障坑' }
                  ]
                }
              ]
            },
            {
              text: 'XPath',
              collapsed: false,
              items: [
                { text: 'Xpath', link: '/开发/xpath/Xpath' }
              ]
            },
            {
              text: '微信小程序',
              collapsed: false,
              items: [
                { text: '关于小程序开发的一些基础知识', link: '/开发/微信小程序/关于小程序开发的一些基础知识' }
              ]
            },
            {
              text: '算法与数据结构',
              collapsed: false,
              items: [
                { text: 'B树和B+树', link: '/开发/算法与数据结构/B树和B+树' },
                { text: '一致性hash及php实现', link: '/开发/算法与数据结构/一致性hash及php实现' },
                { text: '二叉树的中序遍历', link: '/开发/算法与数据结构/二叉树的中序遍历' }
              ]
            }
          ]
        }
      ],
      '/数据库/': [
        {
          text: '🗄️ 数据库',
          items: [
            { text: '分类目录', link: '/数据库/' },
            {
              text: 'MongoDB',
              collapsed: false,
              items: [
                { text: 'MongoDB安装', link: '/数据库/mongodb/MongoDB安装' }
              ]
            },
            {
              text: 'MySQL',
              collapsed: false,
              items: [
                { text: 'INSERT INTO ... ON DUPLICATE KEY UPDATE... 对自增主键的影响', link: '/数据库/mysql/INSERT-INTO-...-ON-DUPLICATE-KEY-UPDATE...-对自增主键的影响' },
                { text: 'Mysql 基于日志（binlog）主从备份', link: '/数据库/mysql/Mysql-基于日志（binlog）主从备份' },
                { text: 'Mysql基础知识', link: '/数据库/mysql/Mysql基础知识' },
                { text: 'Mysql基础知识2', link: '/数据库/mysql/Mysql基础知识2' },
                { text: 'Mysql查询优化', link: '/数据库/mysql/Mysql查询优化' },
                { text: 'Mysql面试题', link: '/数据库/mysql/Mysql面试题' }
              ]
            },
            {
              text: 'Redis',
              collapsed: false,
              items: [
                { text: 'Redis安装', link: '/数据库/redis/Redis安装' },
                { text: 'php操作redis相关的函数', link: '/数据库/redis/php操作redis相关的函数' }
              ]
            },
            {
              text: '通用',
              collapsed: false,
              items: [
                { text: 'MongoDB和MySQL的区别', link: '/数据库/通用/MongoDB和MySQL的区别' },
                { text: 'MySQL和MongoDB的性能测试', link: '/数据库/通用/MySQL和MongoDB的性能测试' },
                { text: '什么是NOSQL', link: '/数据库/通用/什么是NOSQL' },
                { text: '数据同步：全量与增量', link: '/数据库/通用/数据同步：全量与增量' }
              ]
            }
          ]
        }
      ],
      '/运维/': [
        {
          text: '🛠️ 运维与工具',
          items: [
            { text: '分类目录', link: '/运维/' },
            {
              text: 'Git',
              collapsed: false,
              items: [
                { text: 'Git 常用命令速查手册', link: '/运维/git/Git-常用命令速查手册' }
              ]
            },
            {
              text: 'Linux',
              collapsed: false,
              items: [
                { text: 'Yum换源', link: '/运维/linux/Yum换源' },
                { text: 'linux 防火墙设置', link: '/运维/linux/linux-防火墙设置' }
              ]
            },
            {
              text: 'Nginx',
              collapsed: false,
              items: [
                { text: '反向代理与正向代理', link: '/运维/nginx/反向代理与正向代理' }
              ]
            },
            {
              text: 'Windows',
              collapsed: false,
              items: [
                { text: 'Window10 设置定时任务', link: '/运维/windows/Window10-设置定时任务' }
              ]
            },
            {
              text: '容器',
              collapsed: false,
              items: [
                {
                  text: 'Docker',
                  collapsed: false,
                  items: [
                    { text: 'Docker 使用', link: '/运维/容器/docker/Docker-使用' },
                    { text: 'Docker 基础命令', link: '/运维/容器/docker/Docker-基础命令' },
                    { text: 'Podman和Docker', link: '/运维/容器/docker/Podman和Docker' },
                    { text: '安装Docker', link: '/运维/容器/docker/安装Docker' }
                  ]
                },
                {
                  text: 'Harbor',
                  collapsed: false,
                  items: [
                    { text: 'Harbor部署', link: '/运维/容器/harbor/Harbor部署' }
                  ]
                },
                {
                  text: 'Kubernetes',
                  collapsed: false,
                  items: [
                    { text: 'k8s部署一个php项目流程', link: '/运维/容器/kubernetes/k8s部署一个php项目流程' }
                  ]
                }
              ]
            },
            {
              text: '性能测试',
              collapsed: false,
              items: [
                { text: 'Apache Bench(AB) 并发测试', link: '/运维/性能测试/Apache-Bench(AB)-并发测试' }
              ]
            },
            {
              text: '站点部署',
              collapsed: false,
              items: [
                { text: 'GitHub Pages + VitePress 知识库部署手册', link: '/运维/站点部署/gitHub_pages_vitePress_deploy' }
              ]
            }
          ]
        }
      ],
      '/随笔/': [
        {
          text: '📝 生活随笔',
          items: [
            { text: '分类目录', link: '/随笔/' },
            { text: '旅行小记', link: '/随笔/旅行小记' }
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
