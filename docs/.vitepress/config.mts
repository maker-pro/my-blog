
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Maker Pro',
  description: '个人技术博客，记录技术与成长',

  // 对应 GitHub 仓库名称
  base: '/my-blog/',

  themeConfig: {
    logo: undefined,

    nav: [
      { text: '首页', link: '/' },
      { text: 'PHP', link: '/php/laravel' },
      { text: 'Deploy', link: '/deploy/gitHub_pages_vitePress_deploy' },
    ],

    sidebar: {
      '/php/': [
        {
          text: 'PHP',
          items: [
            { text: 'Laravel', link: '/php/laravel' },
            { text: 'php基础', link: '/php/php基础' }
          ]
        }
      ],
      '/deploy/': [
        {
          text: '部署',
          items: [
            { text: 'GitHub Pages+VitePress 部署手册', link: '/deploy/gitHub_pages_vitePress_deploy' }
          ]
        }
      ],
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
