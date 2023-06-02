import { ref } from '@nuxtjs/composition-api'
import { useFirebase } from '.'
import { NO_IMAGE_URL } from '@/utils/image'

type Sort = {
  id: number
  name: string
  description: string
  image: string
}

export const useSortCardList = () => {
  const CARDS_PER_PAGE_NUMBER = 8
  const paginationLength = ref(1)
  const currentPage = ref(1)
  const searchedSorts = ref<Sort[]>([])
  const displayedSorts = ref<Sort[]>([])
  const { getDownloadURL } = useFirebase()

  // ========================================
  // 指定されたページのdisplayedSortsを生成する処理
  // =========================================
  const createDisplayedSorts = async (page: number) => {
    currentPage.value = page

    // 選択されたページからdisplayedSortsに渡す要素のsearchedSorts内での始めのインデックスを求める
    const initialIndex = (page - 1) * CARDS_PER_PAGE_NUMBER

    // displayedSortsを初期化する
    displayedSorts.value = []

    // displayedSortsを生成する
    for (let i = initialIndex; i < initialIndex + CARDS_PER_PAGE_NUMBER; i++) {
      const sort = searchedSorts.value[i]

      // もしsearchedSortsがなくなったら処理を終了
      if (sort === undefined) break
      const image =
        sort.image === ''
          ? NO_IMAGE_URL
          : await getDownloadURL(
              `/images/sort_titles/${searchedSorts.value[i]?.image}`
            )

      displayedSorts.value.push({
        id: sort.id,
        name: sort.name,
        description: sort.description,
        image,
      })
    }
  }

  // =====================================================
  // ページネーションの長さをsearchedSortsの長さから算出する処理
  // =====================================================

  const computePaginationLength = () => {
    paginationLength.value =
      searchedSorts.value.length % CARDS_PER_PAGE_NUMBER
        ? Math.floor(searchedSorts.value.length / CARDS_PER_PAGE_NUMBER) + 1
        : searchedSorts.value.length / CARDS_PER_PAGE_NUMBER
  }

  return {
    CARDS_PER_PAGE_NUMBER,
    paginationLength,
    currentPage,
    searchedSorts,
    displayedSorts,
    createDisplayedSorts,
    computePaginationLength,
  }
}

export default useSortCardList
