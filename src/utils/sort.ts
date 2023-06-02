import type { SortItem } from '@/utils/api/request'

type NextCandidate = [SortItem, SortItem]

interface SortStrategy<SortingState> {
  /** ユーザーがソートしようとしている元の配列 */
  original: SortItem[]
  /** ソートした結果の配列 */
  result: SortItem[]
  /** ソートが終了しているか判断するフラグ */
  isDone: boolean
  /** ソートの進行状況(アルゴリズム上必要なもの) */
  sortingState: SortingState
  /** 次候補ソートアイテム二つを出力する処理 */
  getNextCandidates: () => NextCandidate
  /** ソートアイテム選択後、結果を状態に反映する処理 */
  applyCompareResult: (selectedItem: SortItem) => void
}

type BubbleSortSortingState = {
  topIndex: number
  leftIndex: number
}

export class BubbleSort implements SortStrategy<BubbleSortSortingState> {
  original: SortItem[]
  result: SortItem[]
  isDone: boolean
  readonly sortingState: BubbleSortSortingState

  constructor(original: SortItem[]) {
    this.original = original
    this.result = []
    this.isDone = false
    this.sortingState = {
      topIndex: 0,
      leftIndex: original.length - 2,
    }
  }

  _swap = (items: SortItem[], index1: number, index2: number) => {
    const item1 = items[index1]
    const item2 = items[index2]
    if (item1 !== undefined && item2 !== undefined) {
      items[index1] = item2
      items[index2] = item1
    }
  }

  _getResult = (
    candidate1: SortItem | undefined,
    candidate2: SortItem | undefined
  ) => {
    const result: NextCandidate = [candidate1!, candidate2!]
    return result
  }

  getNextCandidates = () => {
    return this._getResult(
      this.original[this.sortingState.leftIndex],
      this.original[this.sortingState.leftIndex + 1]
    )
  }

  applyCompareResult = (selectedItem: SortItem) => {
    if (this.original[this.sortingState.leftIndex] !== selectedItem)
      this._swap(
        this.original,
        this.sortingState.leftIndex,
        this.sortingState.leftIndex + 1
      )

    if (this.sortingState.leftIndex === this.sortingState.topIndex) {
      this.sortingState.leftIndex = this.original.length - 2
      this.sortingState.topIndex++

      if (this.sortingState.topIndex === this.original.length - 1) {
        this.result = this.original
        this.isDone = true
      }
    } else {
      this.sortingState.leftIndex--
    }

    return undefined
  }
}
