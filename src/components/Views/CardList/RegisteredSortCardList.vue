<template>
  <div class="children:mb-10">
    <SortCardList
      name="registered"
      :sorts="displayedSorts"
      :click-card="clickCard"
    />
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
import { useSortCardList, useToast, useRouter } from '@/composables'
import { searchMultipleRegisterSorts } from '@/utils/api/request'
import { UiStore, AuthStore } from '@/store'

export default defineComponent({
  components: {
    SortCardList: () =>
      import('@/components/Templates/CardList/SortCardList.vue'),
    DefaultPagination,
  },
  setup() {
    const { errorToast } = useToast()
    const { router } = useRouter()
    const {
      paginationLength,
      currentPage,
      searchedSorts,
      displayedSorts,
      createDisplayedSorts,
      computePaginationLength,
    } = useSortCardList()

    const clickCard = (sortId: number) => {
      router.push(`/sort/edit/${sortId}`)
    }

    onMounted(async () => {
      try {
        UiStore.startLoading()

        const postData = {
          user_id: AuthStore.getUserId,
        }

        // ソートの一覧を取得する
        const res = await searchMultipleRegisterSorts(postData)
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
      clickCard,
      searchedSorts,
      displayedSorts,
      paginationLength,
      currentPage,
      createDisplayedSorts,
    }
  },
})
</script>
