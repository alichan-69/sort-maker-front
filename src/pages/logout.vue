<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { useFirebase, useToast, useRouter } from '@/composables'
import { AuthStore } from '@/store'
import auth from '@/middleware/auth'

export default defineComponent({
  name: 'LogoutPage',
  middleware: [auth],
  setup() {
    const { fireModule } = useFirebase()
    const { errorToast, successToast } = useToast()
    const { router } = useRouter()

    onMounted(async () => {
      try {
        // firebaseでログアウト処理
        await fireModule
          .auth()
          .signOut()
          .then(() => {
            // vuexの認証情報を削除
            AuthStore.deleteAuthInfo()

            // トップページに遷移
            successToast('ログアウトに成功しました')
            router.push('/')
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (error: any) {
        errorToast('ログアウトに失敗しました')
      }
    })
  },
  head: {
    title: 'ログアウト',
  },
})
</script>
