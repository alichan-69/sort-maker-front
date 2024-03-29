import type { Store } from 'vuex'
import { initialiseStores } from '~/utils/store'
const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]
export * from '~/utils/store'
