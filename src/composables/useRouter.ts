import useNuxt from './useNuxt'

const useRouter = () => {
  // ========================================
  // routerへのaccessorを取得
  // =========================================
  const { nuxt } = useNuxt()
  const router = nuxt.$router

  return {
    router,
  }
}

export default useRouter
