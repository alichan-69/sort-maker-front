import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { isAuthenticated } from '@/utils/auth'

const authInLoginPage = defineNuxtMiddleware(({ redirect }) => {
  if (isAuthenticated()) return redirect('/')
})

export default authInLoginPage
