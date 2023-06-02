<template>
  <div class="py-10 children:mb-10">
    <h1>どっちを選ぶ？</h1>
    <div class="flex justify-between children:w-[calc(50%-6px)]">
      <VCard
        v-for="(displayedItem, index) in displayedItems"
        :key="`item-card-${index}`"
        class="text-left"
        @click="clickCard(displayedItem)"
      >
        <VImg :src="displayedItem.image" />
        <VCardTitle class="line-clamp-2">{{ displayedItem.name }}</VCardTitle>
      </VCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useRoute, useToast, useFirebase, useRouter } from '@/composables'
import { searchMultipleSortItems, SortItem } from '@/utils/api/request'
import { UiStore, SortStore } from '@/store'
import { BubbleSort } from '@/utils/sort'

export default defineComponent({
  name: 'SortPlayProcess',
  setup() {
    const { route } = useRoute()
    const { errorToast } = useToast()
    const { getDownloadURL } = useFirebase()
    const { router } = useRouter()
    const sortId = ref(Number(route.params.sortId))
    const displayedItems = ref<SortItem[]>([])
    const bubbleSort = ref<InstanceType<typeof BubbleSort>>()

    const clickCard = (selectedItem: SortItem) => {
      bubbleSort.value?.applyCompareResult(selectedItem)

      if (bubbleSort.value?.isDone) {
        SortStore.updateResult(bubbleSort.value.result)
        router.push(`/sort/play/result/${sortId.value}`)
      }

      const nextCandidates = bubbleSort.value?.getNextCandidates()
      if (nextCandidates) displayedItems.value = nextCandidates
    }

    onMounted(async () => {
      try {
        UiStore.startLoading()

        // ソートアイテムのデータを取得
        const postData = {
          id: sortId.value,
        }

        const res = await searchMultipleSortItems(postData)

        const sortItems: SortItem[] = []

        for (const sortItem of res.sort_items) {
          sortItems.push({
            ...sortItem,
            image: await getDownloadURL(`/images/sort_items/${sortItem.image}`),
          })
        }

        bubbleSort.value = new BubbleSort(sortItems)

        displayedItems.value = bubbleSort.value.getNextCandidates()
      } catch (e) {
        errorToast('ソートアイテムの検索に失敗しました')
      } finally {
        UiStore.finishLoading()
      }
    })

    return {
      displayedItems,
      clickCard,
    }
  },
  head: {
    title: 'ソートで遊ぶ',
  },
})
</script>
