<template>
  <ButtonDialog :block="true" button-class-names="bg-warning">
    <template #button> 削除する </template>
    <template #dialog>
      <VCard class="p-4">
        <VCArdTitle>本当に削除しますか？</VCArdTitle>
        <VCardActions>
          <DefaultButton
            :block="true"
            class-names="bg-warning"
            :click="clickDeleteSort"
          >
            削除する
          </DefaultButton>
        </VCardActions>
      </VCard>
    </template>
  </ButtonDialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useToast, useRouter } from '@/composables'
import { UiStore } from '@/store'
import { deleteSort } from '@/utils/api/request'

export default defineComponent({
  components: {
    ButtonDialog: () => import('@/components/Templates/ButtonDialog.vue'),
    DefaultButton: () => import('@/components/Parts/DefaultButton.vue'),
  },
  props: {
    userId: {
      type: String,
      default: '',
      require: true,
    },
    sortId: {
      type: Number,
      default: 0,
      require: true,
    },
  },
  setup({ userId, sortId }) {
    const { successToast, errorToast } = useToast()
    const { router } = useRouter()

    const clickDeleteSort = async () => {
      try {
        // ローディング処理開始
        UiStore.startLoading()

        const postData = {
          user_id: userId,
          sort_id: sortId,
        }

        await deleteSort(postData)

        successToast('ソートを削除しました')
        router.push('/mypage')
      } catch (e) {
        errorToast('ソートの削除に失敗しました')
      } finally {
        // ローディング処理終了
        UiStore.finishLoading()
      }
    }

    return {
      clickDeleteSort,
    }
  },
})
</script>
