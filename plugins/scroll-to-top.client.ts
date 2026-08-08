export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.afterEach(() => {
    if (import.meta.client) {
      window.scrollTo({ top: 0, left: 0 })
    }
  })
})
