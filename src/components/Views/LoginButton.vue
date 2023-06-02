<template>
  <DefaultButton :block="true" class-names="bg-twitter" :click="login">
    <DefaultIcon>mdi-twitter</DefaultIcon>
    ツイッターでログインする
  </DefaultButton>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { DefaultButton, DefaultIcon } from '@/components/Parts'
import { useFirebase, useToast, useCrypto, useRouter } from '@/composables'
import { registerUser } from '@/utils/api/request'
import { AuthStore, UiStore } from '@/store'

type Credential = {
  accessToken?: string
  pendingToken?: string
  providerId: string
  secret?: string
  signInMethod: string
}

export default defineComponent({
  components: {
    DefaultButton,
    DefaultIcon,
  },
  setup() {
    const { fireModule } = useFirebase()
    const { router } = useRouter()
    const { errorToast, successToast } = useToast()
    const { getHashedStr, getEncryptedStr } = useCrypto()
    let resFirebase: firebase.default.auth.UserCredential

    const login = async () => {
      try {
        // ローディング処理開始
        UiStore.startLoading()

        // ツイッターでログイン処理
        const provider = new fireModule.auth.TwitterAuthProvider()
        await fireModule
          .auth()
          .signInWithPopup(provider)
          .then((res) => {
            resFirebase = res
          })
          .catch((error) => {
            throw new Error(error)
          })

        if (resFirebase.user === null) throw new Error('userが存在しません')
        // uidをハッシュ化
        const hashedUid = getHashedStr(resFirebase.user.uid)

        // accesToken,secretを暗号化
        if (resFirebase.credential === null)
          throw new Error('credentialが存在しません')
        const credential: Credential = resFirebase.credential

        if (
          credential.accessToken === undefined ||
          credential.secret === undefined
        )
          throw new Error('accessTokenまたはsecretが存在しません')
        const encryptedAccessToken = getEncryptedStr(credential.accessToken)
        const encryptedSecret = getEncryptedStr(credential.secret)

        // ユーザーを登録
        const displayName = resFirebase.user.displayName || ''
        const postData = {
          id: hashedUid,
          name: displayName,
          access_token: encryptedAccessToken,
          secret: encryptedSecret,
        }

        await registerUser(postData)

        // vuexに認証情報を保管
        const photoURL = resFirebase.user.photoURL || ''

        AuthStore.updateUserId(hashedUid)
        AuthStore.updateDisplayName(displayName)
        AuthStore.updatePhotoURL(photoURL)

        // トップページに遷移(再読み込み)
        successToast('ログインに成功しました')
        router.push('/')
      } catch (e: any) {
        errorToast('ログインに失敗しました')
      } finally {
        // ローディング処理終了
        UiStore.finishLoading()
      }
    }

    return {
      login,
    }
  },
})
</script>
