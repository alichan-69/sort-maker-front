<template>
  <div class="children:mb-10 py-10">
    <VForm ref="sortForm" v-model="editSortValid" class="children:mb-10">
      <h1>ソートを編集する</h1>
      <h2>ソートのタイトル</h2>
      <SortTitleInput
        ref="sortTitleInput"
        class-names="mx-auto w-[300px]"
        :name="titleName"
        :input-name="inputTitleName"
        :description="titleDescription"
        :input-description="inputTitleDescription"
        :click-out-side-dialog="clickOutSideTitleDialog"
        :image-url="titleUrl"
      />
      <h2>ソートアイテム</h2>
      <SortItemInputList
        ref="sortItemInputList"
        name="edit"
        :item-url="itemUrl"
        :item-name="itemName"
        :input-item-name="inputItemName"
        :item-valid="itemValid"
        :input-item-valid="inputItemValid"
        :items="items"
        :input-items-name="inputItemsName"
        :add-sort-item="addSortItem"
        :click-out-side-item-dialog="clickOutSideItemDialog"
        :click-out-side-items-dialog="clickOutsideItemsDialog"
        :remove-sort-item="removeSortItem"
      />
      <DefaultButton :block="true" :click="clickEditSort"
        >ソート編集</DefaultButton
      >
    </VForm>
    <DeleteSortButtonDialog :user-id="userId" :sort-id="sortId" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { DefaultButton } from '@/components/Parts'
import { SortTitleInput, SortItemInputList } from '@/components/Templates'
import { DeleteSortButtonDialog } from '@/components/Views'
import {
  useToast,
  useChangeSort,
  useRoute,
  useFirebase,
  useRouter,
} from '@/composables'
import { NO_IMAGE_URL, getUrlBlob } from '@/utils/image'
import {
  searchSort,
  editSort,
  registerSortImage,
  searchMultipleSortItems,
} from '@/utils/api/request'
import { AuthStore, UiStore } from '@/store'
import auth from '@/middleware/auth'

export default defineComponent({
  name: 'SortEditPage',
  components: {
    SortTitleInput,
    SortItemInputList,
    DefaultButton,
    DeleteSortButtonDialog,
  },
  middleware: [auth],
  setup() {
    const {
      titleName,
      titleDescription,
      titleBlob,
      titleUrl,
      itemValid,
      itemName,
      itemBlob,
      itemUrl,
      items,
      sortForm,
      clickOutSideTitleDialog,
      clickOutSideItemDialog,
      clickOutsideItemsDialog,
      inputTitleName,
      inputTitleDescription,
      inputItemName,
      inputItemValid,
      inputItemsName,
      validateSortItemsNumber,
      addSortItem,
      removeSortItem,
      getExtension,
      registerImageFirebase,
    } = useChangeSort()
    const { route } = useRoute()
    const { router } = useRouter()
    const { successToast, errorToast } = useToast()
    const { getDownloadURL } = useFirebase()
    const editSortValid = ref(false)
    const userId = ref(AuthStore.getUserId)
    const sortId = ref(Number(route.params.sortId))

    const clickEditSort = async () => {
      try {
        // ローディング処理開始
        UiStore.startLoading()

        // バリデーション
        sortForm()!.validate()
        if (!editSortValid.value)
          throw new Error('ソートタイトルのバリデーションがエラーです')
        validateSortItemsNumber()

        // ソートとソートアイテムをデータベースに登録
        const editSortPostData = {
          user_id: userId.value,
          sort_id: sortId.value,
          name: titleName.value,
          description: titleDescription.value,
          item_names: items.value.map((item) => item.name),
        }

        const res = await editSort(editSortPostData)

        // ソートタイトルの画像の拡張子を取得
        if (!titleBlob.value)
          throw new Error(
            'ソートタイトルのblobオブジェクトが取得できませんでした'
          )
        const titleImageExtension = getExtension(titleBlob.value)
        if (!titleImageExtension)
          throw new Error('ソートタイトルの画像の拡張子を取得できませんでした')

        // firebaseCloudStorageに登録するソートタイトルの画像の名前を作成
        const titleImageName = `${sortId}.${titleImageExtension}`

        await registerImageFirebase(
          titleBlob.value,
          `/images/sort_titles/${titleImageName}`
        )

        // firebaseCloudStorageにソートアイテムの画像を登録
        const sortItemIds = res.sort_item_ids
        // ソートアイテムの画像のfirebaseCloudStorageへの登録名を格納する配列を宣言
        const itemImageNames = []

        for (const i in sortItemIds) {
          const item = items.value?.[i]
          if (item === undefined)
            throw new Error('ソートアイテムが存在しませんでした')

          // ソートアイテムの画像の拡張子を取得
          const itemImageExtension = getExtension(item.blob)
          if (!itemImageExtension)
            throw new Error(
              'ソートアイテムの画像の拡張子を取得できませんでした'
            )

          // firebaseCloudStorageに登録するソートアイテムの画像の名前を作成
          const itemImageName = `${sortId}_${sortItemIds[i]}.${itemImageExtension}`

          itemImageNames.push(itemImageName)

          await registerImageFirebase(
            item.blob,
            `/images/sort_items/${itemImageName}`
          )
        }

        // 画像のfirebaseCloudStorageへの登録名をデータベースに登録
        const registerImagePostData = {
          user_id: userId.value,
          image: titleImageName,
          item_images: itemImageNames,
          sort_id: sortId.value,
          sort_item_ids: sortItemIds,
        }

        await registerSortImage(registerImagePostData)

        successToast('ソートを編集しました')
      } catch (e) {
        errorToast('ソートの編集に失敗しました')
      } finally {
        // ローディング処理終了
        UiStore.finishLoading()
      }
    }

    onMounted(async () => {
      try {
        UiStore.startLoading()

        // ソートタイトルのデータを取得
        const searchSortPostData = {
          id: sortId.value,
          user_id: userId.value,
        }

        const searchSortRes = await searchSort(searchSortPostData)

        titleName.value = searchSortRes.name
        titleDescription.value = searchSortRes.description
        titleUrl.value = await getDownloadURL(
          `/images/sort_titles/${searchSortRes.image}`
        )
        titleBlob.value = await getUrlBlob(titleUrl.value)

        // ソートアイテムのデータを取得
        const blob = await getUrlBlob(NO_IMAGE_URL)
        itemBlob.value = blob
        itemUrl.value = NO_IMAGE_URL

        const searchMultipleSortItemsPostData = {
          id: sortId.value,
        }

        const searchMultipleSortItemsRes = await searchMultipleSortItems(
          searchMultipleSortItemsPostData
        )

        for (const sortItem of searchMultipleSortItemsRes.sort_items) {
          const url = await getDownloadURL(
            `/images/sort_items/${sortItem.image}`
          )
          const blob = await getUrlBlob(url)

          items.value.push({
            name: sortItem.name,
            blob,
            url,
          })
        }
      } catch (error: any) {
        if (
          error.message === 'Error: ソートの検索に失敗しました' ||
          error.message ===
            'Error: ソートがユーザーの作成したソートではありません'
        )
          router.push('/mypage')
        errorToast('ソートの検索に失敗しました')
      } finally {
        UiStore.finishLoading()
      }
    })

    return {
      editSortValid,
      titleBlob,
      titleName,
      titleDescription,
      titleUrl,
      itemValid,
      itemName,
      itemUrl,
      items,
      userId,
      sortId,
      inputTitleName,
      inputTitleDescription,
      clickOutSideTitleDialog,
      clickOutSideItemDialog,
      clickOutsideItemsDialog,
      inputItemName,
      inputItemValid,
      inputItemsName,
      addSortItem,
      clickEditSort,
      removeSortItem,
    }
  },
  head: {
    title: 'ソートを編集する',
  },
})
</script>
