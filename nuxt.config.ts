// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from "path";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-content-assets'
    ,'@nuxt/content'
  ],
  plugins: [
    '~/plugins/directives'
  ],
  routeRules: {
    '/': { prerender: true }
  },
  app: {
    baseURL: '/'
  },
  alias: {
    "@": resolve(__dirname, "/")
  },
  head: {
    link: [
      { rel: "icon", type: "image/png", href: "/favicon.png" }, // これを追記する
    ]
  },
  css: ['~/assets/css/main.css', '~/assets/css/utils.css', '~/assets/css/fmdrums.css'],
  compatibilityDate: '2024-07-12',
  contentAssets: {    
    // inject image size hints into the rendered html
    imageSize: 'style attrs',
    
    // treat these extensions as content
    contentExtensions: 'mdx? csv ya?ml json',
    
    // output debug messages
    debug: false,
  }
})