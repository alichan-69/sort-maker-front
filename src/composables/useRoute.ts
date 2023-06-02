import useNuxt from './useNuxt'

const useRoute = () => {
  // ========================================
  // routeへのaccessorを取得
  // =========================================
  const { nuxt } = useNuxt()
  const route = nuxt.$route

  return {
    route,
  }
}

export default useRoute
