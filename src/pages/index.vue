<template>
  <div class="children:mb-10 py-10">
    <h1>ソートを作る</h1>
    <DefaultButton :block="true" href="/sort/register">作る</DefaultButton>
    <h1>ソートで遊ぶ</h1>
    <SearchedSortCardList />
    <h1>人気のソート</h1>
    <PopularSortCardList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { DefaultButton } from '@/components/Parts'
import { SearchedSortCardList, PopularSortCardList } from '@/components/Views'

export default defineComponent({
  name: 'IndexPage',
  components: {
    DefaultButton,
    SearchedSortCardList,
    PopularSortCardList,
  },
  head: {
    title: 'トップ',
  },
})
</script>
