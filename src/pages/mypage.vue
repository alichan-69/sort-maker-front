<template>
  <div class="children:mb-10 py-10">
    <h1>マイページ</h1>
    <h2>お気に入りの編集</h2>
    <LikedSortCardList />
    <h2>作成したソートの編集</h2>
    <RegisteredSortCardList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { LikedSortCardList, RegisteredSortCardList } from '@/components/Views'
import auth from '@/middleware/auth'

export default defineComponent({
  name: 'MyPage',
  components: {
    LikedSortCardList,
    RegisteredSortCardList,
  },
  middleware: [auth],
  head: {
    title: 'マイページ',
  },
})
</script>
