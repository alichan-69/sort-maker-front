<template>
  <div class="children:mb-10">
    <div class="children:mb-2">
      <DefaultTextField
        :value="searchText"
        :input="inputSearchText"
        label="ソートを検索する"
        prepend-icon="mdi-magnify"
      />
      <VRadioGroup v-model="orderMethod" row>
        <VRadio
          v-for="(ORDER_METHODS_EL, i) in ORDER_METHODS"
          :key="`order-method-radio-${i}`"
          :label="ORDER_METHODS_EL.label"
          :value="ORDER_METHODS_EL.value"
          color="secondary"
        />
      </VRadioGroup>
      <DefaultButton class-names="mb-2" :block="true" :click="searchSort"
        >検索</DefaultButton
      >
    </div>
    <SortCardList
      name="searched"
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
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import {
  DefaultButton,
  DefaultTextField,
  DefaultPagination,
} from '@/components/Parts'
import { useSortCardList, useToast, useRouter } from '@/composables'
import { searchMultipleSorts } from '@/utils/api/request'
import { UiStore } from '@/store'

const ORDER_METHODS = [
  {
    label: '人気順',
    value: 'popularity',
  },
  {
    label: '新着順',
    value: 'time',
  },
]

export default defineComponent({
  components: {
    DefaultTextField,
    DefaultButton,
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
    const searchText = ref('')
    const orderMethod = ref(ORDER_METHODS[0]?.value)

    const inputSearchText = (value: string) => {
      searchText.value = value
    }

    const searchSort = async () => {
      try {
        UiStore.startLoading()

        // nameの一部とソート方法のフラグを渡してソートの一覧を取得する
        const postData = {
          part_of_sort_name: searchText.value,
          is_sort_by_popularity: orderMethod.value === ORDER_METHODS[0]?.value,
          is_sort_by_time: orderMethod.value === ORDER_METHODS[1]?.value,
        }
        const res = await searchMultipleSorts(postData)

        searchedSorts.value = res.sorts.map((value) =>
          _.pick(value, ['id', 'name', 'description', 'image'])
        )

        // ページネーションの長さを変更
        computePaginationLength()

        // 表示するソートを1ページ目のソートに変更
        createDisplayedSorts(1)
      } catch {
        UiStore.finishLoading()

        errorToast('ソートの検索に失敗しました')
      } finally {
        UiStore.finishLoading()
      }
    }

    const clickCard = (sortId: number) => {
      router.push(`/sort/play/${sortId}`)
    }

    onMounted(async () => {
      try {
        UiStore.startLoading()

        // ソートの一覧を取得する
        const res = await searchMultipleSorts()
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
      inputSearchText,
      searchText,
      searchSort,
      clickCard,
      searchedSorts,
      displayedSorts,
      paginationLength,
      currentPage,
      ORDER_METHODS,
      orderMethod,
      createDisplayedSorts,
    }
  },
})
</script>
