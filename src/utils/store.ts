import type { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Auth from '@/store/auth'
import Ui from '@/store/ui'
import Sort from '@/store/sort'

// eslint-disable-next-line import/no-mutable-exports
let AuthStore: Auth
// eslint-disable-next-line import/no-mutable-exports
let UiStore: Ui
// eslint-disable-next-line import/no-mutable-exports
let SortStore: Sort

export const initialiseStores = (store: Store<any>): void => {
  AuthStore = getModule(Auth, store)
  UiStore = getModule(Ui, store)
  SortStore = getModule(Sort, store)
}

export { AuthStore, UiStore, SortStore }
