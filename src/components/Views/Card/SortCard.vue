<template>
  <VCard :class="classoverride(classNames, 'text-left')" @click="click">
    <DefaultImage :src="src" />
    <DefaultIconButton color="warning" :click="clickLike">{{
      icon
    }}</DefaultIconButton>
    <VCardTitle class="py-0 text-lg line-clamp-2">{{ name }}</VCardTitle>
    <VCardText class="line-clamp-2 pb-0 mb-4">{{ description }}</VCardText>
  </VCard>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
import { DefaultImage } from '@/components/Parts'
import { isAuthenticated } from '@/utils/auth'
import { useRouter, useToast } from '@/composables'
import { AuthStore } from '@/store'
import { searchLike, deleteLike, registerLike } from '@/utils/api/request'
import { classoverride } from '@/utils/tailwindcss'
import type { Click } from '@/types/event'
import { NO_IMAGE_URL } from '@/utils/image'

const LIKED_HEART_ICON = 'mdi-cards-heart'
const NOT_LIKED_HEART_ICON = 'mdi-cards-heart-outline'

export default defineComponent({
  components: {
    DefaultImage,
    DefaultIconButton: () =>
      import('@/components/Templates/DefaultIconButton.vue'),
  },
  props: {
    classNames: {
      type: String,
      default: '',
      require: false,
    },
    click: {
      type: [Function, Promise] as PropType<Click>,
      default: () => {},
      require: false,
    },
    id: {
      type: Number,
      default: 0,
      require: false,
    },
    src: {
      type: String,
      default: NO_IMAGE_URL,
      require: false,
    },
    name: {
      type: String,
      default: '',
      require: true,
    },
    description: {
      type: String,
      default: '',
      require: true,
    },
  },
  setup({ id }) {
    const icon = ref(NOT_LIKED_HEART_ICON)
    const isLiked = ref(false)
    const { router } = useRouter()
    const { errorToast } = useToast()
    const userId = AuthStore.getUserId

    const clickLike = async (event: Event) => {
      event.stopPropagation()

      // もしユーザーがログインしてなかったらログインページに遷移する
      if (!isAuthenticated) router.push('/login')
      if (isLiked.value) {
        try {
          // お気に入り削除する
          const postData = {
            user_id: userId,
            sort_id: id,
          }

          await deleteLike(postData)

          icon.value = NOT_LIKED_HEART_ICON
          isLiked.value = false
        } catch {
          errorToast('お気に入りの削除に失敗しました')
        }
      } else {
        try {
          // お気に入り登録する
          const postData = {
            user_id: userId,
            sort_id: id,
          }

          await registerLike(postData)

          icon.value = LIKED_HEART_ICON
          isLiked.value = true
        } catch {
          errorToast('お気に入りの削除に失敗しました')
        }
      }
    }

    onMounted(async () => {
      try {
        // もしユーザーがログインしてなかったらお気に入りを検索しない
        if (!isAuthenticated()) throw new Error('ユーザー認証がされていません')
        const postData = {
          user_id: userId,
          sort_id: id,
        }

        const res = await searchLike(postData)

        if (!res.delete_flg) {
          icon.value = LIKED_HEART_ICON
          isLiked.value = true
        }
      } catch (error: any) {
        if (error.message !== 'ユーザー認証がされていません')
          errorToast('お気に入りの表示に失敗しました')
      }
    })

    return {
      icon,
      clickLike,
      classoverride,
    }
  },
})
</script>
