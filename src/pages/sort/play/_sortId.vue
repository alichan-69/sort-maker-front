<template>
  <div class="py-10 children:mb-10">
    <h1>ソートで遊ぶ</h1>
    <SortCard
      :id="sortId"
      :name="name"
      :description="description"
      :src="src"
      class-names="mx-auto w-[300px]"
      :click="playSort"
    />
    <p class="mb-0">作成者：{{ userName }}</p>
    <p>遊ばれた回数：{{ playCount }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useRoute, useToast, useFirebase, useRouter } from '@/composables'
import { SortCard } from '@/components/Views'
import { searchSort, updatePlayCount } from '@/utils/api/request'
import { UiStore } from '@/store'

export default defineComponent({
  name: 'SortPlayrPage',
  components: {
    SortCard,
  },
  setup() {
    const { route } = useRoute()
    const { errorToast } = useToast()
    const { getDownloadURL } = useFirebase()
    const { router } = useRouter()
    const sortId = ref(Number(route.params.sortId))
    const name = ref('')
    const description = ref('')
    const src = ref('')
    const userName = ref('')
    const playCount = ref(0)

    const playSort = async () => {
      // ソートが遊ばれた回数を更新する
      try {
        const postData = {
          sort_id: sortId.value,
        }

        await updatePlayCount(postData)
      } catch {
        errorToast('ソートが遊ばれた回数の更新に失敗しました')
      } finally {
        router.push(`/sort/play/process/${sortId.value}`)
      }
    }

    onMounted(async () => {
      try {
        UiStore.startLoading()

        // ソートのデータを取得
        const postData = {
          id: sortId.value,
        }
        const res = await searchSort(postData)

        name.value = res.name
        description.value = res.description
        src.value = await getDownloadURL(`/images/sort_titles/${res.image}`)
        userName.value = res.user_name
        playCount.value = res.play_count
      } catch (e) {
        errorToast('ソートの検索に失敗しました')
      } finally {
        UiStore.finishLoading()
      }
    })

    return {
      sortId,
      name,
      description,
      src,
      userName,
      playCount,
      playSort,
    }
  },
  head: {
    title: 'ソートで遊ぶ',
  },
})
</script>
