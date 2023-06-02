<template>
  <ButtonDialog
    :block="true"
    :button-class-names="
      classoverride(buttonClassNames, 'bg-twitter text-white')
    "
  >
    <template #button>
      <DefaultIcon :left="true">mdi-twitter</DefaultIcon>
      <slot />
    </template>
    <template #dialog>
      <VCard class="p-4">
        <DefaultTextArea
          counter="128"
          label="ツイッターへの投稿文"
          :rules="rules"
          :value="postText"
          :input="inputPostText"
          class-names="mb-4"
        />
        <VCardActions>
          <DefaultButton
            :block="true"
            class-names="bg-twitter text-white"
            :click="postTextToTwitter"
          >
            <DefaultIcon :left="true">mdi-twitter</DefaultIcon>
            <slot />
          </DefaultButton>
        </VCardActions>
      </VCard>
    </template>
  </ButtonDialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, PropType } from '@nuxtjs/composition-api'
import { DefaultIcon, DefaultTextArea, DefaultButton } from '@/components/Parts'
import { required, textLength } from '@/utils/rules'
import { useToast, useRouter } from '@/composables'
import { UiStore, AuthStore } from '@/store'
import { postTweet } from '@/utils/api/request'
import type { InputText } from '@/types/event'
import { classoverride } from '@/utils/tailwindcss'
import { isAuthenticated } from '@/utils/auth'

export default defineComponent({
  components: {
    ButtonDialog: () => import('@/components/Templates/ButtonDialog.vue'),
    DefaultIcon,
    DefaultTextArea,
    DefaultButton,
  },
  props: {
    buttonClassNames: {
      type: String,
      default: '',
      require: false,
    },
    postText: {
      type: String,
      default: '',
      require: true,
    },
    inputPostText: {
      type: Function as PropType<InputText>,
      default: () => {},
      require: true,
    },
  },
  setup(props) {
    const { successToast, errorToast } = useToast()
    const { router } = useRouter()
    const rules = ref([required, textLength(1, 128)])
    const { postText } = toRefs(props)
    const userId = AuthStore.getUserId

    const postTextToTwitter = async () => {
      // ログインしてなかったらログインページへ遷移
      if (!isAuthenticated()) {
        router.push('/login')
        return
      }
      try {
        // ローディング処理開始
        UiStore.startLoading()

        const postData = {
          user_id: userId,
          text: postText.value,
        }

        await postTweet(postData)

        successToast('ツイッターに投稿しました')
      } catch (e: any) {
        errorToast('ツイッターへの投稿に失敗しました')
      } finally {
        // ローディング処理終了
        UiStore.finishLoading()
      }
    }

    return {
      rules,
      postTextToTwitter,
      classoverride,
    }
  },
})
</script>
