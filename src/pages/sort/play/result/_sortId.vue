<template>
  <div class="py-10 children:mb-10">
    <h1>結果</h1>
    <VDataTable
      :headers="headers"
      :items="items"
      :disable-sort="true"
      :hide-default-footer="true"
    />
    <TwitterButtonDialog
      :post-text="postText"
      :input-post-text="inputPostText"
      button-class-names="mb-5"
    >
      結果をシェアする
    </TwitterButtonDialog>
    <DefaultButton :block="true" :click="replay">もう一度遊ぶ</DefaultButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useRoute, useToast, useRouter, useConfig } from '@/composables'
import { searchSort } from '@/utils/api/request'
import { SortStore, UiStore } from '@/store'
import { TwitterButtonDialog } from '@/components/Views'
import { DefaultButton } from '@/components/Parts'

type Items = {
  rank: string
  name: string
}[]

export default defineComponent({
  name: 'SortPlayResult',
  components: {
    TwitterButtonDialog,
    DefaultButton,
  },
  setup() {
    const { route } = useRoute()
    const { errorToast } = useToast()
    const { router } = useRouter()
    const { config } = useConfig()
    const sortId = ref(Number(route.params.sortId))
    const headers = ref([
      { text: 'ランク', value: 'rank' },
      { text: '名前', value: 'name' },
    ])
    const items = ref<Items>([])
    const postText = ref('')

    const inputPostText = (value: string) => {
      postText.value = value
    }

    const replay = () => {
      router.push(`/sort/play/${sortId.value}`)
    }

    onMounted(async () => {
      // 結果を取得して成形
      for (const index in SortStore.getResult) {
        items.value.push({
          name: SortStore.getResult[index]?.name || '',
          rank: `${Number(index) + 1}位`,
        })
      }

      try {
        UiStore.startLoading()
        // ソートのデータを取得
        const postData = {
          id: sortId.value,
        }
        const res = await searchSort(postData)

        // ツイッターへの投稿文を作成する
        postText.value = `${res.name}のソート結果\n`
        for (const item of items.value) {
          postText.value += `${item.rank}：${item.name}\n`
        }
        postText.value += `${config.APP_URL}/sort/play/${sortId.value}\n#ソートメーカー`
      } catch (e) {
        errorToast('ソートの検索に失敗しました')
      } finally {
        UiStore.finishLoading()
      }
    })
    return {
      headers,
      items,
      postText,
      inputPostText,
      replay,
    }
  },
  head: {
    title: 'ソートで遊ぶ',
  },
})
</script>
