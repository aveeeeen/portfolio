// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    '~/plugins/directives',
    '~/plugins/scroll-to-top.client'
  ],
  routeRules: {
    '/': { prerender: true },
  },
  app: {
    baseURL: '/',
    head: {
      title: "portfolio site of braven",
      meta: [
        { name: 'description', content: '活動履歴やブログをまとめています。'},
        // OGP 共通設定
        { property: 'og:site_name', content: 'portfolio site of braven' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'portfolio site of braven' },
        { property: 'og:description', content: '活動履歴やブログをまとめています。' },
        { property: 'og:url', content: 'https://braveeeeen.vercel.app/' },
        { property: 'og:image', content: 'https://braveeeeen.vercel.app/ogp.png?v=1' }, // 絶対パスで指定

        // X (Twitter) Card 共通設定
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },
  alias: {
    "@": resolve(__dirname, "/")
  },
  css: ['~/assets/css/main.css', '~/assets/css/article.css', '~/assets/css/utils.css', '~/assets/css/fmdrums.css', 'highlight.js/styles/atom-one-dark.css'],
  compatibilityDate: '2024-07-12',
})
