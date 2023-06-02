<template>
  <VForm
    ref="sortForm"
    v-model="registerSortValid"
    class="children:mb-10 py-10"
  >
    <h1>ソートを作る</h1>
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
      name="register"
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
    <DefaultButton :block="true" :click="clickRegisterSort"
      >ソート作成</DefaultButton
    >
  </VForm>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { DefaultButton } from '@/components/Parts'
import { SortTitleInput, SortItemInputList } from '@/components/Templates'
import { useToast, useRouter, useChangeSort } from '@/composables'
import { NO_IMAGE_URL, getUrlBlob } from '@/utils/image'
import { registerSort, registerSortImage } from '@/utils/api/request'
import { AuthStore, UiStore } from '@/store'
import auth from '@/middleware/auth'

export default defineComponent({
  name: 'SortRegisterPage',
  components: {
    SortTitleInput,
    SortItemInputList,
    DefaultButton,
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
    const { errorToast } = useToast()
    const { router } = useRouter()
    const registerSortValid = ref(false)
    const userId = AuthStore.getUserId

    const clickRegisterSort = async () => {
      try {
        // ローディング処理開始
        UiStore.startLoading()

        // バリデーション
        sortForm()!.validate()
        if (!registerSortValid.value)
          throw new Error('ソートタイトルのバリデーションがエラーです')
        validateSortItemsNumber()

        // ソートとソートアイテムをデータベースに登録
        const registerSortPostData = {
          user_id: userId,
          name: titleName.value,
          description: titleDescription.value,
          item_names: items.value.map((item) => item.name),
        }

        const res = await registerSort(registerSortPostData)

        // firebaseCloudStorageにソートタイトルの画像を登録
        const sortId = res.sort_id

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
          user_id: userId,
          image: titleImageName,
          item_images: itemImageNames,
          sort_id: sortId,
          sort_item_ids: sortItemIds,
        }

        await registerSortImage(registerImagePostData)

        router.push({ path: `/sort/register/result/${sortId}` })
      } catch (error: any) {
        if (error.message === 'ソートアイテムの個数が範囲外です') {
          errorToast('ソートアイテムの個数が範囲外です')
        } else {
          errorToast('ソートの登録に失敗しました')
        }
      } finally {
        // ローディング処理終了
        UiStore.finishLoading()
      }
    }

    onMounted(async () => {
      // blobとurlの初期値を作成、代入
      const blob = await getUrlBlob(NO_IMAGE_URL)

      titleBlob.value = blob
      titleUrl.value = NO_IMAGE_URL
      itemBlob.value = blob
      itemUrl.value = NO_IMAGE_URL
    })

    return {
      registerSortValid,
      titleBlob,
      titleName,
      titleDescription,
      titleUrl,
      itemValid,
      itemName,
      itemUrl,
      items,
      inputTitleName,
      inputTitleDescription,
      clickOutSideTitleDialog,
      clickOutSideItemDialog,
      clickOutsideItemsDialog,
      inputItemName,
      inputItemValid,
      inputItemsName,
      addSortItem,
      clickRegisterSort,
      removeSortItem,
    }
  },
  head: {
    title: 'ソートを作る',
  },
})
</script>
