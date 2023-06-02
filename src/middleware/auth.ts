import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { isAuthenticated } from '@/utils/auth'

const auth = defineNuxtMiddleware(({ redirect }) => {
  if (!isAuthenticated()) return redirect('/login')
})

export default auth
