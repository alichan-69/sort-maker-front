import { AuthStore } from '@/store'

// ========================================
// 認証済みか確認する
// =========================================

export const isAuthenticated = () => {
  return Boolean(AuthStore.getUserId)
}
