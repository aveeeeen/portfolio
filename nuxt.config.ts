// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from "path";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-content-assets'
    ,'@nuxt/content'
    ,'@nuxt/image'
  ],
  routeRules: {
    '/': { prerender: true }
  },

  alias: {
    "@": resolve(__dirname, "/")
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-07-12',
  contentAssets: {    
    // inject image size hints into the rendered html
    imageSize: 'style attrs',
    
    // treat these extensions as content
    contentExtensions: 'mdx? csv ya?ml json',
    
    // output debug messages
    debug: false,
  },
  extends: [
    'node_modules/nuxt-content-assets/cache',
  ],
})