<template>
  <div class="children:mb-10">
    <div class="flex flex-wrap gap-x-2 gap-y-10 items-stretch">
      <div
        v-for="(displayedSort, i) in displayedSorts"
        :key="`popular-card-list-card-${i}`"
        class="w-[calc(25%-6px)] sm:w-[calc(50%-6px)]"
      >
        <h2>{{ computeRank(i) }}位</h2>
        <SortCard
          :id="displayedSort.id"
          :name="displayedSort.name"
          :description="displayedSort.description"
          :src="displayedSort.image"
          class-names="h-[calc(100%-28px)]"
          :click="() => clickCard(displayedSort.id)"
        />
      </div>
    </div>
    <DefaultPagination
      :value="currentPage"
      :length="paginationLength"
      :input="createDisplayedSorts"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { DefaultPagination } from '@/components/Parts'
import { SortCard } from '@/components/Views'
import { useSortCardList, useToast, useRouter } from '@/composables'
import { searchMultipleSorts } from '@/utils/api/request'
import { UiStore } from '@/store'

export default defineComponent({
  components: {
    DefaultPagination,
    SortCard,
  },
  setup() {
    const { errorToast } = useToast()
    const { router } = useRouter()
    const {
      CARDS_PER_PAGE_NUMBER,
      paginationLength,
      currentPage,
      searchedSorts,
      displayedSorts,
      createDisplayedSorts,
      computePaginationLength,
    } = useSortCardList()

    const computeRank = (index: number) =>
      (currentPage.value - 1) * CARDS_PER_PAGE_NUMBER + index + 1

    const clickCard = (sortId: number) => {
      router.push(`/sort/play/${sortId}`)
    }

    onMounted(async () => {
      try {
        UiStore.startLoading()

        // 人気のソートの一覧を取得する
        const postData = {
          is_sort_by_popularity: true,
        }
        const res = await searchMultipleSorts(postData)
        searchedSorts.value = res.sorts.map((value) =>
          _.pick(value, ['id', 'name', 'description', 'image'])
        )
        // ページネーションの長さを初期化
        computePaginationLength()
        // displayedSortsを初期化
        createDisplayedSorts(1)
      } catch {
        errorToast('ソートの表示に失敗しました')
      } finally {
        UiStore.finishLoading()
      }
    })

    return {
      searchedSorts,
      displayedSorts,
      paginationLength,
      currentPage,
      computeRank,
      createDisplayedSorts,
      clickCard,
    }
  },
})
</script>
