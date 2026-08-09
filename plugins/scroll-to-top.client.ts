export default defineNuxtPlugin(() => {
  const router = useRouter()
  router.afterEach(() => {
    if (import.meta.client) {
      window.scrollTo({ top: 0, left: 0 })
    }
  })
})
