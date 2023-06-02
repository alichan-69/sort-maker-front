<template>
  <VAppBar class="bg-primary text-white justify-between max-h-14">
    <VToolbarTitle class="cursor-pointer">
      <DefaultImage
        class-names="w-72"
        :src="LOGO_URL"
        alt="ソートメーカー"
        :click="clickLogo"
      />
    </VToolbarTitle>
    <VSpacer />
    <ul v-if="PC || tablet" class="flex">
      <li v-for="(link, i) in links" :key="`guide-link-${i}`">
        <DefaultRouterLink class-names="px-4 text-white" :to="link.to">{{
          link.label
        }}</DefaultRouterLink>
      </li>
    </ul>
    <VMenu v-if="sm" offset-y>
      <template #activator="{ on, attrs }">
        <DefaultImage
          class-names="w-12 rounded-[50%]"
          :src="userImage"
          :v-bind="attrs"
          :v-on="on"
        />
      </template>
      <VList>
        <VListItem v-for="(link, i) in links" :key="`guide-link-${i}`">
          <VListItemTitle
            ><DefaultRouterLink class="text-text" :to="link.to">{{
              link.label
            }}</DefaultRouterLink></VListItemTitle
          >
        </VListItem>
      </VList>
    </VMenu>
  </VAppBar>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { DefaultImage, DefaultRouterLink } from '@/components/Parts'
import { useMediaQuery, useRouter } from '@/composables'
import { AuthStore } from '@/store'
import { isAuthenticated } from '@/utils/auth'
import { LOGO_URL, NO_USER_IMAGE_URL } from '@/utils/image'

export default defineComponent({
  components: {
    DefaultImage,
    DefaultRouterLink,
  },
  setup() {
    const { sm, tablet, PC } = useMediaQuery()
    const { router } = useRouter()
    const userImage = computed(() => AuthStore.getPhotoURL || NO_USER_IMAGE_URL)
    const links = computed(() => [
      {
        label: '作る',
        to: '/sort/register',
      },
      {
        label: '遊ぶ',
        to: '/',
      },
      {
        label: 'マイページ',
        to: '/mypage',
      },
      {
        label: isAuthenticated() ? 'ログアウト' : 'ログイン',
        to: isAuthenticated() ? '/logout' : '/login',
      },
    ])

    const clickLogo = () => {
      router.push('/')
    }

    return {
      sm,
      tablet,
      PC,
      userImage,
      links,
      LOGO_URL,
      clickLogo,
    }
  },
})
</script>
