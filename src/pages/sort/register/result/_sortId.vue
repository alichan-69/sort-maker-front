<template>
  <div class="py-10">
    <h1 class="mb-10">ソートを作成しました</h1>
    <SortCard
      :id="sortId"
      :name="name"
      :description="description"
      :src="src"
      class-names="mx-auto w-[300px] mb-10"
    />
    <TwitterButtonDialog
      :post-text="postText"
      :input-post-text="inputPostText"
      button-class-names="mb-5"
    >
      ソートをシェアする
    </TwitterButtonDialog>
    <DefaultButton :block="true" :click="reRegister" class-names="mb-10"
      >もう一度作る</DefaultButton
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import {
  useRoute,
  useToast,
  useFirebase,
  useRouter,
  useConfig,
} from '@/composables'
import { DefaultButton } from '@/components/Parts'
import { SortCard, TwitterButtonDialog } from '@/components/Views'
import { searchSort } from '@/utils/api/request'
import { UiStore } from '@/store'
import auth from '@/middleware/auth'

export default defineComponent({
  name: 'SortRegisterResultPage',
  components: {
    SortCard,
    TwitterButtonDialog,
    DefaultButton,
  },
  middleware: [auth],
  setup() {
    const { route } = useRoute()
    const { errorToast } = useToast()
    const { getDownloadURL } = useFirebase()
    const { router } = useRouter()
    const { config } = useConfig()
    const sortId = ref(Number(route.params.sortId))
    const name = ref('')
    const description = ref('')
    const src = ref('')
    const postText = ref('')

    const inputPostText = (value: string) => {
      postText.value = value
    }

    const reRegister = () => {
      router.push('/sort/register')
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
        postText.value = `${name.value}を作成しました！\nソートして遊んでみてね。\n${config.APP_URL}/sort/play/${sortId.value}\n#ソートメーカー`
      } catch {
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
      postText,
      inputPostText,
      reRegister,
    }
  },
  head: {
    title: 'ソートを作る',
  },
})
</script>
