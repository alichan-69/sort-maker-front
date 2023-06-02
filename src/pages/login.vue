<template>
  <div class="children:mb-10">
    <h1 class="mt-10">ログイン</h1>
    <LoginButton />
    <VCard class="text-left">
      <VCardTitle
        >ソートメーカーでツイッターログインすると下記のことができます</VCardTitle
      >
      <VCardText class="text-left">
        <ul class="list-disc">
          <li>ソートを作成する</li>
          <li>ソートのお気に入りを登録する</li>
        </ul>
      </VCardText>
    </VCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { LoginButton } from '@/components/Views'
import authInLoginPage from '@/middleware/authInLoginPage'

export default defineComponent({
  name: 'LoginPage',
  components: {
    LoginButton,
  },
  middleware: [authInLoginPage],
  head: {
    title: 'ログイン',
  },
})
</script>
