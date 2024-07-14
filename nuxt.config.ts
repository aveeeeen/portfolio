// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from "path";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content'
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
  
})